package KarmaTute.KarmaTute.competency;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompetencySnapshotRepository extends JpaRepository<CompetencySnapshot, Long> {
    List<CompetencySnapshot> findByUserIdAndCompetencyIdOrderByTimestampDesc(Long userId, Long competencyId);
}