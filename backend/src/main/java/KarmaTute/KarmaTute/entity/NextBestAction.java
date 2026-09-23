package KarmaTute.KarmaTute.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "next_best_actions")
public class NextBestAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "competency_id")
    private Competency competency;

    private String title;
    @Column(length = 1000)
    private String description;
    @Column(length = 1000)
    private String whyThis;
    private String actionType;
    private Integer estimatedMinutes;
    private String actionRoute;
    private String status;

    public NextBestAction() {}

    public NextBestAction(User user, Competency competency, String title, String description, String whyThis, String actionType, Integer estimatedMinutes, String actionRoute, String status) {
        this.user = user;
        this.competency = competency;
        this.title = title;
        this.description = description;
        this.whyThis = whyThis;
        this.actionType = actionType;
        this.estimatedMinutes = estimatedMinutes;
        this.actionRoute = actionRoute;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Competency getCompetency() { return competency; }
    public void setCompetency(Competency competency) { this.competency = competency; }
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
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
