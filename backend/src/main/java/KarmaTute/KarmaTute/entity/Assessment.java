package KarmaTute.KarmaTute.entity;

import jakarta.persistence.*;
import KarmaTute.KarmaTute.enums.AssessmentLevel;
import java.util.List;

@Entity
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private AssessmentLevel level;

    private Integer timeLimitMinutes;

    @ManyToOne
    @JoinColumn(name = "competency_id")
    private Competency competency;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Question> questions;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Rubric> rubrics;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public AssessmentLevel getLevel() { return level; }
    public void setLevel(AssessmentLevel level) { this.level = level; }
    public Integer getTimeLimitMinutes() { return timeLimitMinutes; }
    public void setTimeLimitMinutes(Integer timeLimitMinutes) { this.timeLimitMinutes = timeLimitMinutes; }
    public Competency getCompetency() { return competency; }
    public void setCompetency(Competency competency) { this.competency = competency; }
    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
    public List<Rubric> getRubrics() { return rubrics; }
    public void setRubrics(List<Rubric> rubrics) { this.rubrics = rubrics; }
}