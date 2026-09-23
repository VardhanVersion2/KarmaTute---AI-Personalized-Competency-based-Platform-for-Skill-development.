package KarmaTute.KarmaTute.certificate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByCertificateId(String certificateId);
    Optional<Certificate> findByUserIdAndCompetencyIdAndStatus(Long userId, Long competencyId, CertificateStatus status);
    List<Certificate> findByUserId(Long userId);
    List<Certificate> findByStatus(CertificateStatus status);
}
