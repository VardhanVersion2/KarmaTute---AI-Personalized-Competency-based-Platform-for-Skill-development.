package KarmaTute.KarmaTute.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "competency_gaps")
public class CompetencyGap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "competency_id")
    private Competency competency;

    private Integer currentLevel;
    private Integer targetLevel;
    private Integer gapPercentage;
    private String priority;
    private String status;

    public CompetencyGap() {}

    public CompetencyGap(User user, Competency competency, Integer currentLevel, Integer targetLevel, Integer gapPercentage, String priority, String status) {
        this.user = user;
        this.competency = competency;
        this.currentLevel = currentLevel;
        this.targetLevel = targetLevel;
        this.gapPercentage = gapPercentage;
        this.priority = priority;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Competency getCompetency() { return competency; }
    public void setCompetency(Competency competency) { this.competency = competency; }
    public Integer getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(Integer currentLevel) { this.currentLevel = currentLevel; }
    public Integer getTargetLevel() { return targetLevel; }
    public void setTargetLevel(Integer targetLevel) { this.targetLevel = targetLevel; }
    public Integer getGapPercentage() { return gapPercentage; }
    public void setGapPercentage(Integer gapPercentage) { this.gapPercentage = gapPercentage; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
