package KarmaTute.KarmaTute.aigateway;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AIGatewayResponse<T> {
    private T data;
    private String requestId;
    private String modelUsed;
    private int promptTokens;
    private int completionTokens;
    private long latencyMs;
    private boolean fromCache;
    private boolean fallbackUsed;
}