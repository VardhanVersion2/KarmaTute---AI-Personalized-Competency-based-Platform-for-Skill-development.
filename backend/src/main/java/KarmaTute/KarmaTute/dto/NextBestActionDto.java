package KarmaTute.KarmaTute.dto;

public class NextBestActionDto {
    private Long id;
    private String title;
    private String description;
    private String whyThis;
    private String actionType;
    private Integer estimatedMinutes;
    private String actionRoute;

    public NextBestActionDto() {}

    public NextBestActionDto(Long id, String title, String description, String whyThis, String actionType, Integer estimatedMinutes, String actionRoute) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.whyThis = whyThis;
        this.actionType = actionType;
        this.estimatedMinutes = estimatedMinutes;
        this.actionRoute = actionRoute;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getWhyThis() { return whyThis; }
    public void setWhyThis(String whyThis) { this.whyThis = whyThis; }
    public String getActionType() { return actionType; }
    public void setActionType(String actionType) { this.actionType = actionType; }
    public Integer getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(Integer estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }
    public String getActionRoute() { return actionRoute; }
    public void setActionRoute(String actionRoute) { this.actionRoute = actionRoute; }
}
