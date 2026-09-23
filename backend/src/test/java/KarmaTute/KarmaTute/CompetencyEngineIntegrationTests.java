package KarmaTute.KarmaTute;

import KarmaTute.KarmaTute.competency.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class CompetencyEngineIntegrationTests {

    @Autowired
    private CompetencyEngine competencyEngine;

    @Autowired
    private CompetencySnapshotRepository snapshotRepository;
    
    @Autowired
    private EvidenceRecordRepository evidenceRepository;

    @Test
    public void testCompetencySnapshotBeforeAfter() {
        Long userId = 1001L;
        Long competencyId = 2002L;
        
        evidenceRepository.deleteAll();
        snapshotRepository.deleteAll();

        EvidenceRecord ev1 = EvidenceRecord.builder()
                .userId(userId)
                .competencyId(competencyId)
                .type(EvidenceType.MCQ)
                .source("KarmaTute-ExecutionLab")
                .score(80.0)
                .normalizedScore(80.0)
                .confidence(0.9)
                .provenance("system")
                .reviewStatus(ReviewStatus.APPROVED)
                .build();
                
        competencyEngine.ingestEvidence(ev1);
        
        List<CompetencySnapshot> snapshotsAfter1 = snapshotRepository.findByUserIdAndCompetencyIdOrderByTimestampDesc(userId, competencyId);
        assertEquals(1, snapshotsAfter1.size());
        assertEquals(80.0, snapshotsAfter1.get(0).getCurrent(), 0.01);
        assertTrue(snapshotsAfter1.get(0).getEvidenceIds().contains(ev1.getId().toString()));

        EvidenceRecord ev2 = EvidenceRecord.builder()
                .userId(userId)
                .competencyId(competencyId)
                .type(EvidenceType.SCENARIO)
                .source("Pratyaksha")
                .score(90.0)
                .normalizedScore(90.0)
                .confidence(1.0)
                .provenance("provider-x")
                .reviewStatus(ReviewStatus.APPROVED)
                .build();
                
        competencyEngine.ingestEvidence(ev2);
        
        List<CompetencySnapshot> snapshotsAfter2 = snapshotRepository.findByUserIdAndCompetencyIdOrderByTimestampDesc(userId, competencyId);
        assertEquals(2, snapshotsAfter2.size());
        
        double expectedScore = 162.0 / 1.9;
        
        CompetencySnapshot latest = snapshotsAfter2.get(0);
        assertEquals(expectedScore, latest.getCurrent(), 0.01);
        assertEquals(100.0 - expectedScore, latest.getGap(), 0.01);
        
        assertEquals("v1.0.0", latest.getEngineVersion());
        assertEquals("r1.0.0", latest.getRuleVersion());
        
        assertTrue(latest.getEvidenceIds().contains(ev1.getId().toString()));
        assertTrue(latest.getEvidenceIds().contains(ev2.getId().toString()));
    }
}
