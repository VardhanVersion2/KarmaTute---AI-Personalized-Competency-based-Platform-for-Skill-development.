package KarmaTute.KarmaTute.repository;

import KarmaTute.KarmaTute.entity.CompetencyGap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetencyGapRepository extends JpaRepository<CompetencyGap, Long> {
    List<CompetencyGap> findByUserId(Long userId);
    Optional<CompetencyGap> findFirstByUserIdAndStatusOrderByGapPercentageDesc(Long userId, String status);
}
