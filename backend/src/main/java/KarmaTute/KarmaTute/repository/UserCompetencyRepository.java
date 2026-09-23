package KarmaTute.KarmaTute.repository;

import KarmaTute.KarmaTute.entity.UserCompetency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCompetencyRepository extends JpaRepository<UserCompetency, Long> {
    List<UserCompetency> findByUserId(Long userId);
}
