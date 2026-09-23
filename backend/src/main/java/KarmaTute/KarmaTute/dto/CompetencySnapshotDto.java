package KarmaTute.KarmaTute.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CompetencySnapshotDto {
    private Long id;
    private Long competencyId;
    private Double current;
    private Double target;
    private Double gap;
    private Double confidence;
    private String evidenceIds;
    private String engineVersion;
    private String ruleVersion;
    private LocalDateTime timestamp;
}
