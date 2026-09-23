package KarmaTute.KarmaTute.aigateway;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class AIGatewayRequest {
    private AITaskType taskType;
    private String systemPrompt;
    private String userPrompt;
    private Map<String, Object> variables;
    private Class<?> outputClass; // For structured JSON mapping and validation
    private Integer maxTokens;
    private Boolean bypassCache;
}