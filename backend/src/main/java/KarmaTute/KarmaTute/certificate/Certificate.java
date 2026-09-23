package KarmaTute.KarmaTute.certificate;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "certificates")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Certificate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String certificateId;      // KT-{userId}-{competencyId}-{timestamp}
    private Long userId;
    private Long competencyId;
    private Double achievedScore;
    private Double requiredScore;      // Policy: 85.0
    private String competencySummary;
    @Column(length = 500)
    private String evidenceSnapshot;   // IDs at time of issuance
    @Enumerated(EnumType.STRING)
    private CertificateStatus status;
    private String engineVersion;
    private String ruleVersion;
    private String integrityHash;      // SHA-256 of key fields
    private LocalDateTime issuedAt;
    private LocalDateTime revokedAt;
    private String revocationReason;
}
