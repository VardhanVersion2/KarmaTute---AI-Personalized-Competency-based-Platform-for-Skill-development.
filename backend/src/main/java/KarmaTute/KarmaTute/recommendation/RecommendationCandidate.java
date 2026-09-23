package KarmaTute.KarmaTute.recommendation;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation_candidates")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RecommendationCandidate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long competencyId;
    private String title;
    private String description;
    private String source;         // iGOT, NSSTA, INTERNAL, PRATYAKSHA
    private String sourceRef;
    private String sourceStatus;   // LIVE, SANDBOX, MOCK, PLANNED, UNAVAILABLE
    private Integer estimatedMinutes;
    private String actionType;     // MCQ, VOICE_SIM, WRITTEN, COURSE, VIDEO
    private String actionRoute;

    private Double matchScore;
    @Column(length = 2000)
    private String rankingFactors; // JSON blob: {rolefit:0.9, levelfit:0.8, ...}
    @Column(length = 1000)
    private String whyThis;        // Human-readable explanation of actual factors
    private Double confidence;
    private String status;         // RECOMMENDED, DISMISSED, COMPLETED
    private String engineVersion;
    private LocalDateTime generatedAt;
    private LocalDateTime expiresAt;
}
