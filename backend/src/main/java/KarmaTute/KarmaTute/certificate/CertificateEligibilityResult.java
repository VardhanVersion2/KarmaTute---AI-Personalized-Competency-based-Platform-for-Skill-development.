package KarmaTute.KarmaTute.certificate;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class CertificateEligibilityResult {
    private boolean eligible;
    private Double achievedScore;
    private Double requiredScore;
    private boolean hasRequiredEvidence;
    private boolean hasUnresolvedReview;
    private List<String> failureReasons;
}
