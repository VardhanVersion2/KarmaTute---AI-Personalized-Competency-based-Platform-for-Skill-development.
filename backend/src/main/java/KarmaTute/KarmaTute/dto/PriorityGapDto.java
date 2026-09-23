package KarmaTute.KarmaTute.dto;

public class PriorityGapDto {
    private Long competencyId;
    private String competencyName;
    private String domain;
    private Integer currentLevel;
    private Integer targetLevel;
    private Integer gapPercentage;
    private String priority;

    public PriorityGapDto() {}

    public PriorityGapDto(Long competencyId, String competencyName, String domain, Integer currentLevel, Integer targetLevel, Integer gapPercentage, String priority) {
        this.competencyId = competencyId;
        this.competencyName = competencyName;
        this.domain = domain;
        this.currentLevel = currentLevel;
        this.targetLevel = targetLevel;
        this.gapPercentage = gapPercentage;
        this.priority = priority;
    }

    public Long getCompetencyId() { return competencyId; }
    public void setCompetencyId(Long competencyId) { this.competencyId = competencyId; }
    public String getCompetencyName() { return competencyName; }
    public void setCompetencyName(String competencyName) { this.competencyName = competencyName; }
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public Integer getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(Integer currentLevel) { this.currentLevel = currentLevel; }
    public Integer getTargetLevel() { return targetLevel; }
    public void setTargetLevel(Integer targetLevel) { this.targetLevel = targetLevel; }
    public Integer getGapPercentage() { return gapPercentage; }
    public void setGapPercentage(Integer gapPercentage) { this.gapPercentage = gapPercentage; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
