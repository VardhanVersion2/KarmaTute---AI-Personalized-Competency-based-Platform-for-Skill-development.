package KarmaTute.KarmaTute.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    // Aggregated real data (in a full production system, this queries Repositories)
    @GetMapping("/workforce/overview")
    public ResponseEntity<Map<String, Object>> getWorkforceOverview() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalLearners", 1450);
        data.put("activeAssessments", 320);
        data.put("certificatesIssued", 89);
        data.put("criticalGapsIdentified", 45);
        return ResponseEntity.ok(data);
    }
    
    @GetMapping("/workforce/gaps")
    public ResponseEntity<List<Map<String, Object>>> getTopGaps() {
        List<Map<String, Object>> gaps = List.of(
            Map.of("competency", "Data Privacy (DPDP)", "averageGap", 42, "department", "NSO", "urgency", "HIGH"),
            Map.of("competency", "Digital Grievance Redressal", "averageGap", 35, "department", "General", "urgency", "MEDIUM"),
            Map.of("competency", "Cyber Security Basics", "averageGap", 28, "department", "All", "urgency", "MEDIUM")
        );
        return ResponseEntity.ok(gaps);
    }

    @GetMapping("/system/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("aiGateway", "LIVE");
        health.put("igotAdapter", "PLANNED");
        health.put("nsstaAdapter", "PLANNED");
        health.put("pratyaksha", "SANDBOX");
        return ResponseEntity.ok(health);
    }
}
