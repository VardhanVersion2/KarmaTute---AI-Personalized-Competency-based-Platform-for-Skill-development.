package KarmaTute.KarmaTute.repository;

import KarmaTute.KarmaTute.entity.AssessmentAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentAttemptRepository extends JpaRepository<AssessmentAttempt, Long> {
    List<AssessmentAttempt> findByUserId(Long userId);
    List<AssessmentAttempt> findByUserIdAndAssessmentId(Long userId, Long assessmentId);
}