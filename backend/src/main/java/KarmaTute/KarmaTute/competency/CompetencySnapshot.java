package KarmaTute.KarmaTute.competency;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "competency_snapshots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompetencySnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId;
    private Long competencyId;
    
    @Column(name = "current_score")
    private Double current;
    
    private Double target;
    private Double gap;
    private Double confidence;
    
    @Column(columnDefinition = "TEXT")
    private String evidenceIds;
    
    private String engineVersion;
    private String ruleVersion;
    private LocalDateTime timestamp;
}