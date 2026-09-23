package KarmaTute.KarmaTute.service;

import KarmaTute.KarmaTute.competency.*;
import KarmaTute.KarmaTute.dto.CompetencySnapshotDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvidenceService {

    private final EvidenceRecordRepository evidenceRepository;
    private final CompetencySnapshotRepository snapshotRepository;
    private final CompetencyEngine competencyEngine;

    public EvidenceService(EvidenceRecordRepository evidenceRepository,
                           CompetencySnapshotRepository snapshotRepository,
                           CompetencyEngine competencyEngine) {
        this.evidenceRepository = evidenceRepository;
        this.snapshotRepository = snapshotRepository;
        this.competencyEngine = competencyEngine;
    }

    @Transactional
    public EvidenceRecord submitEvidence(EvidenceRecord record) {
        if (record.getReviewStatus() == null) {
            record.setReviewStatus(ReviewStatus.APPROVED);
        }
        return competencyEngine.ingestEvidence(record);
    }

    public List<EvidenceRecord> getUserEvidence(Long userId) {
        return evidenceRepository.findAll().stream()
            .filter(r -> r.getUserId() != null && r.getUserId().equals(userId))
            .collect(Collectors.toList());
    }

    public List<CompetencySnapshotDto> getCompetencySnapshots(Long userId) {
        return snapshotRepository.findAll().stream()
            .filter(s -> s.getUserId() != null && s.getUserId().equals(userId))
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public List<CompetencySnapshotDto> getCompetencyHistory(Long userId, Long competencyId) {
        return snapshotRepository.findByUserIdAndCompetencyIdOrderByTimestampDesc(userId, competencyId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    private CompetencySnapshotDto toDto(CompetencySnapshot s) {
        return new CompetencySnapshotDto(
            s.getId(), s.getCompetencyId(), s.getCurrent(), s.getTarget(),
            s.getGap(), s.getConfidence(), s.getEvidenceIds(),
            s.getEngineVersion(), s.getRuleVersion(), s.getTimestamp()
        );
    }
}
