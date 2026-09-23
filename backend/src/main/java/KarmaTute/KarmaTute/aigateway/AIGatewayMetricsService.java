package KarmaTute.KarmaTute.aigateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class AIGatewayMetricsService {
    private static final Logger log = LoggerFactory.getLogger(AIGatewayMetricsService.class);

    private final AtomicInteger totalRequests = new AtomicInteger(0);
    private final AtomicInteger totalFailures = new AtomicInteger(0);
    private final AtomicLong totalTokens = new AtomicLong(0);

    // Hardcoded budget for demonstration
    private final long TOKEN_BUDGET = 1_000_000;

    public void recordMetrics(String requestId, String model, int promptTokens, int completionTokens, long latencyMs, boolean error) {
        totalRequests.incrementAndGet();
        if (error) {
            totalFailures.incrementAndGet();
            log.error("AI Gateway Request Failed | ID: {} | Model: {} | Latency: {}ms", requestId, model, latencyMs);
        } else {
            long tokensUsed = promptTokens + completionTokens;
            totalTokens.addAndGet(tokensUsed);
            log.info("AI Gateway Request Success | ID: {} | Model: {} | Tokens: {} | Latency: {}ms | Budget Left: {}", 
                requestId, model, tokensUsed, latencyMs, getRemainingBudget());
        }
    }

    public boolean isBudgetExhausted() {
        return totalTokens.get() >= TOKEN_BUDGET;
    }

    public long getRemainingBudget() {
        return Math.max(0, TOKEN_BUDGET - totalTokens.get());
    }
}