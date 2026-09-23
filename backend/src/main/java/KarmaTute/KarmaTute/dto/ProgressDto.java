package KarmaTute.KarmaTute.dto;

public class ProgressDto {
    private Integer overallProgressPercent;
    private Integer completedMilestones;
    private Integer totalMilestones;
    private Integer activeStreakDays;

    public ProgressDto() {}

    public ProgressDto(Integer overallProgressPercent, Integer completedMilestones, Integer totalMilestones, Integer activeStreakDays) {
        this.overallProgressPercent = overallProgressPercent;
        this.completedMilestones = completedMilestones;
        this.totalMilestones = totalMilestones;
        this.activeStreakDays = activeStreakDays;
    }

    public Integer getOverallProgressPercent() { return overallProgressPercent; }
    public void setOverallProgressPercent(Integer overallProgressPercent) { this.overallProgressPercent = overallProgressPercent; }
    public Integer getCompletedMilestones() { return completedMilestones; }
    public void setCompletedMilestones(Integer completedMilestones) { this.completedMilestones = completedMilestones; }
    public Integer getTotalMilestones() { return totalMilestones; }
    public void setTotalMilestones(Integer totalMilestones) { this.totalMilestones = totalMilestones; }
    public Integer getActiveStreakDays() { return activeStreakDays; }
    public void setActiveStreakDays(Integer activeStreakDays) { this.activeStreakDays = activeStreakDays; }
}
