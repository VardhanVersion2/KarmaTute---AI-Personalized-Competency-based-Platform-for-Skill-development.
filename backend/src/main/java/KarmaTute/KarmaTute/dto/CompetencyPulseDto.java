package KarmaTute.KarmaTute.dto;

public class CompetencyPulseDto {
    private Integer overallMastery;
    private Integer verifiedCount;
    private Integer totalTracked;
    private Integer resolutionProgress;
    private String pulseStatus;

    public CompetencyPulseDto() {}

    public CompetencyPulseDto(Integer overallMastery, Integer verifiedCount, Integer totalTracked, Integer resolutionProgress, String pulseStatus) {
        this.overallMastery = overallMastery;
        this.verifiedCount = verifiedCount;
        this.totalTracked = totalTracked;
        this.resolutionProgress = resolutionProgress;
        this.pulseStatus = pulseStatus;
    }

    public Integer getOverallMastery() { return overallMastery; }
    public void setOverallMastery(Integer overallMastery) { this.overallMastery = overallMastery; }
    public Integer getVerifiedCount() { return verifiedCount; }
    public void setVerifiedCount(Integer verifiedCount) { this.verifiedCount = verifiedCount; }
    public Integer getTotalTracked() { return totalTracked; }
    public void setTotalTracked(Integer totalTracked) { this.totalTracked = totalTracked; }
    public Integer getResolutionProgress() { return resolutionProgress; }
    public void setResolutionProgress(Integer resolutionProgress) { this.resolutionProgress = resolutionProgress; }
    public String getPulseStatus() { return pulseStatus; }
    public void setPulseStatus(String pulseStatus) { this.pulseStatus = pulseStatus; }
}
