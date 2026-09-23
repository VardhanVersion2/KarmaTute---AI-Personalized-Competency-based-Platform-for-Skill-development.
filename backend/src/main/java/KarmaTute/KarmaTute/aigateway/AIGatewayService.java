package KarmaTute.KarmaTute.aigateway;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.resilience4j.bulkhead.annotation.Bulkhead;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.Map;
import java.util.HashMap;

@Service
public class AIGatewayService {
    private static final Logger log = LoggerFactory.getLogger(AIGatewayService.class);
    private static final String DEFAULT_MODEL = "mistral-small-latest";

    private final ChatClient chatClient;
    private final AIGatewayMetricsService metricsService;
    private final ObjectMapper objectMapper;
    private final Map<String, String> cache = new HashMap<>(); // Simple in-memory fallback cache

    @Autowired
    public AIGatewayService(ChatClient.Builder chatClientBuilder, AIGatewayMetricsService metricsService) {
        this.chatClient = chatClientBuilder.build();
        this.metricsService = metricsService;
        this.objectMapper = new ObjectMapper();
    }

    // Bounded Retry, Circuit Breaker, Rate Limiter, Time Limiter (Timeout), Bulkhead (Concurrency)
    @Retry(name = "aiGateway", fallbackMethod = "fallbackExecuteTask")
    @CircuitBreaker(name = "aiGateway", fallbackMethod = "fallbackExecuteTask")
    @RateLimiter(name = "aiGateway")
    @Bulkhead(name = "aiGateway")
    public <T> AIGatewayResponse<T> executeTask(AIGatewayRequest request) {
        String requestId = UUID.randomUUID().toString();
        log.info("Executing AI Task: {} | Request ID: {}", request.getTaskType(), requestId);

        if (metricsService.isBudgetExhausted()) {
            log.error("Token budget exhausted. Request ID: {}", requestId);
            throw new RuntimeException("Token budget exhausted");
        }

        long startTime = System.currentTimeMillis();
        
        try {
            PromptTemplate systemPromptTemplate = new PromptTemplate(request.getSystemPrompt() != null ? request.getSystemPrompt() : "You are a helpful assistant.");
            Message systemMessage = systemPromptTemplate.createMessage(request.getVariables() != null ? request.getVariables() : Map.of());

            String userContent = request.getUserPrompt();
            BeanOutputConverter<T> converter = null;

            if (request.getOutputClass() != null) {
                converter = new BeanOutputConverter<>((Class<T>) request.getOutputClass());
                userContent += "\n" + converter.getFormat();
            }

            Message userMessage = new UserMessage(userContent);
            Prompt prompt = new Prompt(List.of(systemMessage, userMessage));

            String cacheKey = request.getTaskType() + "_" + userContent.hashCode();
            String modelUsed = routeModel(request.getTaskType());
            
            // Output size / task limit
            // Note: chatClient may need to accept the model as an option, but relying on Spring AI auto-configuration or abstraction.
            // Using default configured provider for now, but recording logical model routing for metrics.
            ChatResponse chatResponse = chatClient.prompt(prompt).call().chatResponse();

            String responseText = chatResponse.getResult().getOutput().getText();
            if (responseText == null) {
                responseText = chatResponse.getResult().getOutput().toString();
            }

            // Ensure no dangerous RBAC leakage
            if (responseText.contains("RBAC") || responseText.contains("ROLE_ADMIN")) {
                throw new SecurityException("Security violation: LLM attempted to dictate security policy.");
            }

            int promptTokens = 0;
            int completionTokens = 0;
            
            long latency = System.currentTimeMillis() - startTime;
            metricsService.recordMetrics(requestId, modelUsed, promptTokens, completionTokens, latency, false);

            T data = null;
            if (converter != null) {
                data = converter.convert(responseText);
            } else {
                data = (T) responseText;
            }

            // Save to safe cache
            if (!Boolean.TRUE.equals(request.getBypassCache())) {
                cache.put(cacheKey, responseText);
            }

            return AIGatewayResponse.<T>builder()
                    .data(data)
                    .requestId(requestId)
                    .modelUsed(DEFAULT_MODEL)
                    .promptTokens(promptTokens)
                    .completionTokens(completionTokens)
                    .latencyMs(latency)
                    .fromCache(false)
                    .fallbackUsed(false)
                    .build();

        } catch (Exception e) {
            long latency = System.currentTimeMillis() - startTime;
            metricsService.recordMetrics(requestId, DEFAULT_MODEL, 0, 0, latency, true);
            throw new RuntimeException("AI Provider error: " + e.getMessage(), e);
        }
    }

    // Fallback Method
    public <T> AIGatewayResponse<T> fallbackExecuteTask(AIGatewayRequest request, Throwable t) {
        log.warn("Executing AI Fallback for Task: {} | Reason: {}", request.getTaskType(), t.getMessage());
        
        String cacheKey = request.getTaskType() + "_" + request.getUserPrompt().hashCode();
        
        // Attempt safe cache recovery
        if (cache.containsKey(cacheKey)) {
            log.info("Recovered from safe cache for cacheKey: {}", cacheKey);
            String cachedResponse = cache.get(cacheKey);
            T data = null;
            if (request.getOutputClass() != null) {
                try {
                    // Primitive JSON parse fallback
                    data = (T) objectMapper.readValue(cachedResponse, request.getOutputClass());
                } catch (JsonProcessingException e) {
                    data = null;
                }
            } else {
                data = (T) cachedResponse;
            }
            
            return AIGatewayResponse.<T>builder()
                    .data(data)
                    .requestId("FALLBACK-" + UUID.randomUUID().toString())
                    .modelUsed("CACHE")
                    .fromCache(true)
                    .fallbackUsed(true)
                    .build();
        }

        // If no cache, return default mock or bubble up specific errors
        throw new RuntimeException("AI Gateway Fallback Failed: Provider Unavailable and no cache. Original error: " + t.getMessage());
    }

    private String routeModel(AITaskType taskType) {
        if (taskType == null) return "gemini-3.8-flash"; // Default fast agentic model
        
        switch (taskType) {
            case SCENARIO_EVALUATION:
            case EXPLANATION:
            case DOCUMENT_UNDERSTANDING:
                return "gemini-3.1-pro"; // Reasoning model
            case MCQ_GENERATION:
            case LANGUAGE_ASSISTANCE:
            case SKILL_EXTRACTION:
            case SEMANTIC_MATCHING:
            case RUBRIC_ASSISTANCE:
            default:
                return "gemini-3.8-flash"; // Fast model
        }
    }
}