package KarmaTute.KarmaTute.entity;

import jakarta.persistence.*;
import KarmaTute.KarmaTute.enums.AssessmentState;
import java.time.LocalDateTime;

@Entity
public class AssessmentAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;

    @Enumerated(EnumType.STRING)
    private AssessmentState state;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer score;
    private Double confidenceScore;

    @Column(columnDefinition = "TEXT")
    private String userSubmissionText;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Assessment getAssessment() { return assessment; }
    public void setAssessment(Assessment assessment) { this.assessment = assessment; }
    public AssessmentState getState() { return state; }
    public void setState(AssessmentState state) { this.state = state; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getUserSubmissionText() { return userSubmissionText; }
    public void setUserSubmissionText(String userSubmissionText) { this.userSubmissionText = userSubmissionText; }
}