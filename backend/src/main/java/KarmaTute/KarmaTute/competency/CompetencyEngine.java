package KarmaTute.KarmaTute.competency;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompetencyEngine {
    private static final Logger log = LoggerFactory.getLogger(CompetencyEngine.class);
    private static final String ENGINE_VERSION = "v1.0.0";
    private static final String RULE_VERSION = "r1.0.0";
    
    // Configurable target - in reality, fetched from a Competency Dictionary
    private static final Double DEFAULT_TARGET = 100.0; 

    private final EvidenceRecordRepository evidenceRepository;
    private final CompetencySnapshotRepository snapshotRepository;
    private final ApplicationEventPublisher eventPublisher;

    public CompetencyEngine(EvidenceRecordRepository evidenceRepository,
                            CompetencySnapshotRepository snapshotRepository,
                            ApplicationEventPublisher eventPublisher) {
        this.evidenceRepository = evidenceRepository;
        this.snapshotRepository = snapshotRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public EvidenceRecord ingestEvidence(EvidenceRecord record) {
        // AI may assist extraction, but here we persist the deterministic record.
        record.setEngineVersion(ENGINE_VERSION);
        record.setRuleVersion(RULE_VERSION);
        if (record.getTimestamp() == null) {
            record.setTimestamp(LocalDateTime.now());
        }
        
        EvidenceRecord saved = evidenceRepository.save(record);
        log.info("Ingested Evidence: {}", saved.getId());
        
        // Trigger Engine Evaluation
        evaluateCompetency(saved.getUserId(), saved.getCompetencyId());
        
        return saved;
    }

    @Transactional
    public void evaluateCompetency(Long userId, Long competencyId) {
        List<EvidenceRecord> records = evidenceRepository.findByUserIdAndCompetencyId(userId, competencyId)
                .stream()
                .filter(r -> r.getReviewStatus() == ReviewStatus.APPROVED || r.getReviewStatus() == null)
                .collect(Collectors.toList());

        if (records.isEmpty()) {
            return;
        }

        // Deterministic Arithmetic: Weighted average by confidence
        double totalWeightedScore = 0.0;
        double totalWeight = 0.0;
        
        for (EvidenceRecord rec : records) {
            double conf = rec.getConfidence() != null ? rec.getConfidence() : 1.0;
            double score = rec.getNormalizedScore() != null ? rec.getNormalizedScore() : 0.0;
            totalWeightedScore += score * conf;
            totalWeight += conf;
        }
        
        double currentScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0.0;
        double avgConfidence = totalWeight > 0 ? (totalWeight / records.size()) : 0.0;
        double gap = DEFAULT_TARGET - currentScore;

        String evidenceIdsStr = records.stream()
                .map(r -> String.valueOf(r.getId()))
                .collect(Collectors.joining(","));

        CompetencySnapshot snapshot = CompetencySnapshot.builder()
                .userId(userId)
                .competencyId(competencyId)
                .current(currentScore)
                .target(DEFAULT_TARGET)
                .gap(gap)
                .confidence(avgConfidence)
                .evidenceIds(evidenceIdsStr)
                .engineVersion(ENGINE_VERSION)
                .ruleVersion(RULE_VERSION)
                .timestamp(LocalDateTime.now())
                .build();

        snapshot = snapshotRepository.save(snapshot);
        log.info("Saved Competency Snapshot for User {} / Comp {}. New Score: {}", userId, competencyId, currentScore);

        eventPublisher.publishEvent(new CompetencyUpdatedEvent(this, snapshot));
    }
}