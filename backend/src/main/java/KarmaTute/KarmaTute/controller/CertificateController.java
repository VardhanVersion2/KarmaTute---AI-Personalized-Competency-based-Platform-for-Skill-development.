package KarmaTute.KarmaTute.controller;

import KarmaTute.KarmaTute.certificate.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/certificate")
@CrossOrigin(origins = "*")
public class CertificateController {
    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping("/eligibility/{userId}/{competencyId}")
    public ResponseEntity<CertificateEligibilityResult> checkEligibility(
            @PathVariable Long userId, @PathVariable Long competencyId) {
        return ResponseEntity.ok(certificateService.checkEligibility(userId, competencyId));
    }

    @PostMapping("/issue/{userId}/{competencyId}")
    public ResponseEntity<Certificate> issueCertificate(
            @PathVariable Long userId, @PathVariable Long competencyId) {
        try {
            return ResponseEntity.ok(certificateService.issueCertificate(userId, competencyId));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Certificate>> getUserCertificates(@PathVariable Long userId) {
        return ResponseEntity.ok(certificateService.getUserCertificates(userId));
    }

    @GetMapping("/verify/{certificateId}")
    public ResponseEntity<Certificate> verifyCertificate(@PathVariable String certificateId) {
        return certificateService.verifyCertificate(certificateId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
