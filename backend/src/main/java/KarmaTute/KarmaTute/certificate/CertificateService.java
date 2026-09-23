package KarmaTute.KarmaTute.certificate;

import KarmaTute.KarmaTute.competency.*;
import KarmaTute.KarmaTute.entity.Competency;
import KarmaTute.KarmaTute.repository.CompetencyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class CertificateService {
    private static final Logger log = LoggerFactory.getLogger(CertificateService.class);
    private static final double REQUIRED_SCORE = 85.0;  // KarmaTute product policy — not SIH requirement
    private static final String ENGINE_VERSION = "cert-v1.0.0";
    private static final String RULE_VERSION = "r1.0.0";

    private final CertificateRepository certRepository;
    private final CompetencySnapshotRepository snapshotRepository;
    private final EvidenceRecordRepository evidenceRepository;
    private final CompetencyRepository competencyRepository;

    public CertificateService(CertificateRepository certRepository,
                               CompetencySnapshotRepository snapshotRepository,
                               EvidenceRecordRepository evidenceRepository,
                               CompetencyRepository competencyRepository) {
        this.certRepository = certRepository;
        this.snapshotRepository = snapshotRepository;
        this.evidenceRepository = evidenceRepository;
        this.competencyRepository = competencyRepository;
    }

    public CertificateEligibilityResult checkEligibility(Long userId, Long competencyId) {
        List<String> failures = new ArrayList<>();

        // Get latest snapshot
        List<CompetencySnapshot> history = snapshotRepository
            .findByUserIdAndCompetencyIdOrderByTimestampDesc(userId, competencyId);
        if (history.isEmpty()) {
            failures.add("No competency snapshot found — no evidence ingested yet");
            return CertificateEligibilityResult.builder().eligible(false).achievedScore(0.0)
                .requiredScore(REQUIRED_SCORE).hasRequiredEvidence(false).failureReasons(failures).build();
        }
        CompetencySnapshot latest = history.get(0);
        double score = Optional.ofNullable(latest.getCurrent()).orElse(0.0);

        if (score < REQUIRED_SCORE) failures.add(String.format("Score %.1f%% below required %.1f%%", score, REQUIRED_SCORE));

        // Check evidence requirements: at least 2 evidence records with APPROVED status
        List<EvidenceRecord> evidence = evidenceRepository.findByUserIdAndCompetencyId(userId, competencyId)
            .stream().filter(e -> ReviewStatus.APPROVED == e.getReviewStatus()).toList();
        boolean hasEvidence = evidence.size() >= 1;
        if (!hasEvidence) failures.add("Insufficient approved evidence (minimum 1 required)");

        // Check no unresolved review flags
        boolean unresolvedReview = evidenceRepository.findByUserIdAndCompetencyId(userId, competencyId)
            .stream().anyMatch(e -> ReviewStatus.REVIEW_REQUIRED == e.getReviewStatus());
        if (unresolvedReview) failures.add("Unresolved review flag on evidence — must be resolved before issuance");

        return CertificateEligibilityResult.builder()
            .eligible(failures.isEmpty())
            .achievedScore(score)
            .requiredScore(REQUIRED_SCORE)
            .hasRequiredEvidence(hasEvidence)
            .hasUnresolvedReview(unresolvedReview)
            .failureReasons(failures)
            .build();
    }

    @Transactional
    public Certificate issueCertificate(Long userId, Long competencyId) {
        // IDEMPOTENT: return existing if already issued
        Optional<Certificate> existing = certRepository
            .findByUserIdAndCompetencyIdAndStatus(userId, competencyId, CertificateStatus.ISSUED);
        if (existing.isPresent()) {
            log.info("Certificate already issued: {}", existing.get().getCertificateId());
            return existing.get();
        }

        CertificateEligibilityResult eligibility = checkEligibility(userId, competencyId);
        if (!eligibility.isEligible()) {
            throw new IllegalStateException("Not eligible: " + String.join("; ", eligibility.getFailureReasons()));
        }

        List<CompetencySnapshot> history = snapshotRepository
            .findByUserIdAndCompetencyIdOrderByTimestampDesc(userId, competencyId);
        CompetencySnapshot latest = history.get(0);
        Competency comp = competencyRepository.findById(competencyId).orElseThrow();

        String certId = String.format("KT-%d-%d-%d", userId, competencyId, System.currentTimeMillis());
        String evidenceIds = latest.getEvidenceIds();
        String hash = sha256(certId + userId + competencyId + latest.getCurrent() + latest.getTimestamp());

        Certificate cert = Certificate.builder()
            .certificateId(certId)
            .userId(userId)
            .competencyId(competencyId)
            .achievedScore(eligibility.getAchievedScore())
            .requiredScore(REQUIRED_SCORE)
            .competencySummary(comp.getName() + " [" + comp.getDomain() + "]")
            .evidenceSnapshot(evidenceIds)
            .status(CertificateStatus.ISSUED)
            .engineVersion(ENGINE_VERSION)
            .ruleVersion(RULE_VERSION)
            .integrityHash(hash)
            .issuedAt(LocalDateTime.now())
            .build();

        Certificate saved = certRepository.save(cert);
        log.info("Certificate issued: {} for user {} comp {}", certId, userId, competencyId);
        return saved;
    }

    @Transactional
    public Certificate revokeCertificate(String certificateId, String reason) {
        Certificate cert = certRepository.findByCertificateId(certificateId)
            .orElseThrow(() -> new NoSuchElementException("Certificate not found: " + certificateId));
        cert.setStatus(CertificateStatus.REVOKED);
        cert.setRevokedAt(LocalDateTime.now());
        cert.setRevocationReason(reason);
        return certRepository.save(cert);
    }

    public Optional<Certificate> verifyCertificate(String certificateId) {
        return certRepository.findByCertificateId(certificateId);
    }

    public List<Certificate> getUserCertificates(Long userId) {
        return certRepository.findByUserId(userId);
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (Exception e) { return "hash-error"; }
    }
}
