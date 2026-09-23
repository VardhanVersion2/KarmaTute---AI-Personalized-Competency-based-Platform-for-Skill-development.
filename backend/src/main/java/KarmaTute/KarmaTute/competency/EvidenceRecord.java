package KarmaTute.KarmaTute.competency;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "evidence_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvidenceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private Long competencyId;
    
    @Enumerated(EnumType.STRING)
    private EvidenceType type;
    
    private String source;
    private String sourceRef;
    
    private Double score;
    private Double normalizedScore;
    private Double confidence;
    
    private LocalDateTime timestamp;
    private String provenance;
    private String ruleVersion;
    private String engineVersion;
    
    @Enumerated(EnumType.STRING)
    private ReviewStatus reviewStatus;
}