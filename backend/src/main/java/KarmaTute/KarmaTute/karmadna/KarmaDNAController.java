package KarmaTute.KarmaTute.karmadna;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/karmadna")
@CrossOrigin(origins = "*")
public class KarmaDNAController {
    private final KarmaDNAService karmaDNAService;

    public KarmaDNAController(KarmaDNAService karmaDNAService) {
        this.karmaDNAService = karmaDNAService;
    }

    @GetMapping("/export/{userId}")
    public ResponseEntity<KarmaDNAExportResult> exportData(@PathVariable Long userId) throws Exception {
        return ResponseEntity.ok(karmaDNAService.exportDNA(userId));
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importData(@RequestBody Map<String, String> payload) throws Exception {
        String data = payload.get("karmaData");
        String key = payload.get("secretKey");
        return ResponseEntity.ok(karmaDNAService.importDNA(data, key));
    }
}
