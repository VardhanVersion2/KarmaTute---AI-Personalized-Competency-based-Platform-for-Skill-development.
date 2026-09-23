package KarmaTute.KarmaTute.controller;

import KarmaTute.KarmaTute.competency.EvidenceRecord;
import KarmaTute.KarmaTute.dto.CompetencySnapshotDto;
import KarmaTute.KarmaTute.service.EvidenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evidence")
@CrossOrigin(origins = "*")
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @PostMapping
    public ResponseEntity<EvidenceRecord> submitEvidence(@RequestBody EvidenceRecord record) {
        return ResponseEntity.ok(evidenceService.submitEvidence(record));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EvidenceRecord>> getUserEvidence(@PathVariable Long userId) {
        return ResponseEntity.ok(evidenceService.getUserEvidence(userId));
    }

    @GetMapping("/competency-snapshot/user/{userId}")
    public ResponseEntity<List<CompetencySnapshotDto>> getCompetencySnapshots(@PathVariable Long userId) {
        return ResponseEntity.ok(evidenceService.getCompetencySnapshots(userId));
    }

    @GetMapping("/competency-snapshot/user/{userId}/competency/{competencyId}")
    public ResponseEntity<List<CompetencySnapshotDto>> getCompetencyHistory(
        @PathVariable Long userId, @PathVariable Long competencyId) {
        return ResponseEntity.ok(evidenceService.getCompetencyHistory(userId, competencyId));
    }
}
