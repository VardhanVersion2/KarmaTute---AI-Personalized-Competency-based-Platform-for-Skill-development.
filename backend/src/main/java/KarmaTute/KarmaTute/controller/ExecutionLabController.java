package KarmaTute.KarmaTute.controller;

import KarmaTute.KarmaTute.dto.AssessmentAttemptRequest;
import KarmaTute.KarmaTute.dto.SubmitMCQRequest;
import KarmaTute.KarmaTute.dto.SubmitOCRRequest;
import KarmaTute.KarmaTute.entity.Assessment;
import KarmaTute.KarmaTute.entity.AssessmentAttempt;
import KarmaTute.KarmaTute.service.ExecutionLabService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/execution-lab")
@CrossOrigin(origins = "*")
public class ExecutionLabController {

    @Autowired
    private ExecutionLabService executionLabService;

    @GetMapping("/assessments")
    public ResponseEntity<List<Assessment>> getAssessments() {
        return ResponseEntity.ok(executionLabService.getAllAssessments());
    }

    @PostMapping("/start")
    public ResponseEntity<AssessmentAttempt> startAttempt(@RequestBody AssessmentAttemptRequest request) {
        return ResponseEntity.ok(executionLabService.startAttempt(request.getUserId(), request.getAssessmentId()));
    }

    @PostMapping("/{attemptId}/submit-mcq")
    public ResponseEntity<AssessmentAttempt> submitMCQ(@PathVariable Long attemptId, @RequestBody SubmitMCQRequest request) {
        return ResponseEntity.ok(executionLabService.submitMCQ(attemptId, request));
    }

    @PostMapping("/{attemptId}/submit-ocr")
    public ResponseEntity<AssessmentAttempt> submitOCR(@PathVariable Long attemptId, @RequestBody SubmitOCRRequest request) {
        return ResponseEntity.ok(executionLabService.submitOCR(attemptId, request));
    }
}
