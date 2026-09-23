package KarmaTute.KarmaTute.repository;

import KarmaTute.KarmaTute.entity.EvidenceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenceItemRepository extends JpaRepository<EvidenceItem, Long> {
    List<EvidenceItem> findByUserIdOrderByVerifiedAtDesc(Long userId);
}
