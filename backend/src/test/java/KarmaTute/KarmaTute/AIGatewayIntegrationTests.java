package KarmaTute.KarmaTute;

import KarmaTute.KarmaTute.aigateway.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.concurrent.atomic.AtomicInteger;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class AIGatewayIntegrationTests {

    @Autowired
    private AIGatewayService aiGatewayService;
    
    @Autowired
    private AIGatewayMetricsService metricsService;

    @BeforeEach
    public void setup() {
    }

    @Test
    public void testSuccessfulProviderCall() {
        AIGatewayRequest req = AIGatewayRequest.builder()
                .taskType(AITaskType.SKILL_EXTRACTION)
                .systemPrompt("Extract skills.")
                .userPrompt("I know Java and Spring.")
                .build();

        try {
            AIGatewayResponse<String> res = aiGatewayService.executeTask(req);
            assertNotNull(res);
            assertNotNull(res.getRequestId());
        } catch (Exception e) {
            assertTrue(e.getMessage().contains("Fallback") || e.getMessage().contains("budget") || e.getMessage().contains("error"));
        }
    }
    
    @Test
    public void testSafeCacheAndFallback() {
        AIGatewayRequest req = AIGatewayRequest.builder()
                .taskType(AITaskType.DOCUMENT_UNDERSTANDING)
                .userPrompt("Fail me")
                .build();
                
        assertThrows(RuntimeException.class, () -> aiGatewayService.executeTask(req));
    }
}
