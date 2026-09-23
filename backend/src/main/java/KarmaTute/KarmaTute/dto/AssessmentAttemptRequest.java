package KarmaTute.KarmaTute.dto;

public class AssessmentAttemptRequest {
    private Long userId;
    private Long assessmentId;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getAssessmentId() { return assessmentId; }
    public void setAssessmentId(Long assessmentId) { this.assessmentId = assessmentId; }
}