package KarmaTute.KarmaTute.service;

import KarmaTute.KarmaTute.dto.SubmitMCQRequest;
import KarmaTute.KarmaTute.dto.SubmitOCRRequest;
import KarmaTute.KarmaTute.entity.*;
import KarmaTute.KarmaTute.enums.AssessmentState;
import KarmaTute.KarmaTute.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ExecutionLabService {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private AssessmentAttemptRepository attemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OCRResultRepository ocrResultRepository;

    @Autowired
    private EvidenceItemRepository evidenceItemRepository;

    public List<Assessment> getAllAssessments() {
        return assessmentRepository.findAll();
    }

    @Transactional
    public AssessmentAttempt startAttempt(Long userId, Long assessmentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        AssessmentAttempt attempt = new AssessmentAttempt();
        attempt.setUser(user);
        attempt.setAssessment(assessment);
        attempt.setState(AssessmentState.STARTED);
        attempt.setStartTime(LocalDateTime.now());
        
        return attemptRepository.save(attempt);
    }

    @Transactional
    public AssessmentAttempt submitMCQ(Long attemptId, SubmitMCQRequest request) {
        AssessmentAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (attempt.getState() != AssessmentState.STARTED) {
            throw new RuntimeException("Attempt is not in STARTED state");
        }

        attempt.setState(AssessmentState.PROCESSING);
        attempt = attemptRepository.save(attempt);

        List<Question> questions = questionRepository.findByAssessmentId(attempt.getAssessment().getId());
        
        int correct = 0;
        for (Question q : questions) {
            String selected = request.getAnswers().get(q.getId());
            if (selected != null && selected.equalsIgnoreCase(q.getCorrectAnswer())) {
                correct++;
            }
        }

        int score = (int) Math.round(((double) correct / questions.size()) * 100);
        attempt.setScore(score);
        attempt.setEndTime(LocalDateTime.now());
        
        if (score >= 70) {
            attempt.setState(AssessmentState.COMPLETED);
            createEvidence(attempt);
        } else {
            attempt.setState(AssessmentState.FAILED);
        }

        return attemptRepository.save(attempt);
    }

    @Transactional
    public AssessmentAttempt submitOCR(Long attemptId, SubmitOCRRequest request) {
        AssessmentAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (attempt.getState() != AssessmentState.STARTED) {
            throw new RuntimeException("Attempt is not in STARTED state");
        }

        attempt.setState(AssessmentState.PROCESSING);
        attempt.setEndTime(LocalDateTime.now());
        attempt = attemptRepository.save(attempt);

        OCRResult ocrResult = new OCRResult();
        ocrResult.setAttempt(attempt);
        ocrResult.setExtractedText(request.getSimulatedExtractedText());
        ocrResult.setConfidenceScore(request.getSimulatedConfidence());

        if (request.getSimulatedConfidence() < 0.85) {
            ocrResult.setNeedsReview(true);
            attempt.setState(AssessmentState.REVIEW_REQUIRED);
        } else {
            ocrResult.setNeedsReview(false);
            // Simulate LLM Rubric Evaluation passing
            attempt.setScore(85); 
            attempt.setState(AssessmentState.COMPLETED);
            createEvidence(attempt);
        }

        ocrResultRepository.save(ocrResult);
        return attemptRepository.save(attempt);
    }

    private void createEvidence(AssessmentAttempt attempt) {
        EvidenceItem evidence = new EvidenceItem();
        evidence.setUser(attempt.getUser());
        evidence.setTitle(attempt.getAssessment().getTitle() + " Passed");
        evidence.setCategory("ExecutionLab");
        evidence.setProvenance("KarmaTute Execution Lab (Level " + attempt.getAssessment().getLevel().name() + ")");
        evidence.setConfidenceScore(1.0);
        evidence.setStatus("VERIFIED");
        evidence.setVerifiedAt(LocalDateTime.now());
        evidenceItemRepository.save(evidence);
    }
}
