package KarmaTute.KarmaTute;

import KarmaTute.KarmaTute.dto.SubmitOCRRequest;
import KarmaTute.KarmaTute.entity.*;
import KarmaTute.KarmaTute.enums.AssessmentLevel;
import KarmaTute.KarmaTute.enums.AssessmentState;
import KarmaTute.KarmaTute.repository.*;
import KarmaTute.KarmaTute.service.ExecutionLabService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ExecutionLabIntegrationTests {

    @Autowired
    private ExecutionLabService executionLabService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private AssessmentAttemptRepository attemptRepository;
    
    @Autowired
    private OCRResultRepository ocrResultRepository;

    private User testUser;
    private Assessment testAssessment;

    @BeforeEach
    public void setup() {
        ocrResultRepository.deleteAll();
        attemptRepository.deleteAll();

        testUser = new User();
        testUser.setUsername("testuser_" + System.currentTimeMillis());
        testUser.setFullName("Test User");
        testUser.setRole("LEARNER");
        userRepository.save(testUser);

        testAssessment = new Assessment();
        testAssessment.setTitle("Test Assessment " + System.currentTimeMillis());
        testAssessment.setLevel(AssessmentLevel.LEVEL_2_WRITTEN);
        assessmentRepository.save(testAssessment);
    }

    @Test
    public void testStartAttempt() {
        AssessmentAttempt attempt = executionLabService.startAttempt(testUser.getId(), testAssessment.getId());

        assertNotNull(attempt.getId());
        assertEquals(AssessmentState.STARTED, attempt.getState());
        assertEquals(testUser.getId(), attempt.getUser().getId());
    }

    @Test
    public void testOCRSubmission_HighConfidence_Completes() {
        AssessmentAttempt attempt = executionLabService.startAttempt(testUser.getId(), testAssessment.getId());

        SubmitOCRRequest request = new SubmitOCRRequest();
        request.setSimulatedExtractedText("This is a good answer.");
        request.setSimulatedConfidence(0.95);

        AssessmentAttempt updated = executionLabService.submitOCR(attempt.getId(), request);

        assertEquals(AssessmentState.COMPLETED, updated.getState());
        assertEquals(85, updated.getScore());
    }

    @Test
    public void testOCRSubmission_LowConfidence_RequiresReview() {
        AssessmentAttempt attempt = executionLabService.startAttempt(testUser.getId(), testAssessment.getId());

        SubmitOCRRequest request = new SubmitOCRRequest();
        request.setSimulatedExtractedText("Th1s 1s b@d 0cr.");
        request.setSimulatedConfidence(0.60);

        AssessmentAttempt updated = executionLabService.submitOCR(attempt.getId(), request);

        assertEquals(AssessmentState.REVIEW_REQUIRED, updated.getState());
    }
}
