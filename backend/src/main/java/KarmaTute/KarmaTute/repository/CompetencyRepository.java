package KarmaTute.KarmaTute.repository;

import KarmaTute.KarmaTute.entity.Competency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompetencyRepository extends JpaRepository<Competency, Long> {
    Optional<Competency> findByCode(String code);
}
