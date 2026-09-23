package KarmaTute.KarmaTute.repository;

import KarmaTute.KarmaTute.entity.NextBestAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NextBestActionRepository extends JpaRepository<NextBestAction, Long> {
    List<NextBestAction> findByUserId(Long userId);
    Optional<NextBestAction> findFirstByUserIdAndStatus(Long userId, String status);
}
