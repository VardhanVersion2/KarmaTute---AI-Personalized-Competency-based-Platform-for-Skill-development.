package KarmaTute.KarmaTute.recommendation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecommendationRepository extends JpaRepository<RecommendationCandidate, Long> {
    List<RecommendationCandidate> findByUserIdAndStatusOrderByMatchScoreDesc(Long userId, String status);
    Optional<RecommendationCandidate> findFirstByUserIdAndStatusOrderByMatchScoreDesc(Long userId, String status);
    void deleteByUserIdAndStatus(Long userId, String status);
    boolean existsByUserIdAndSourceRefAndStatus(Long userId, String sourceRef, String status);
}
