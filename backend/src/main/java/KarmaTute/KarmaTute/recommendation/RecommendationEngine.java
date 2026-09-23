package KarmaTute.KarmaTute.recommendation;

import KarmaTute.KarmaTute.competency.CompetencySnapshot;
import KarmaTute.KarmaTute.competency.CompetencySnapshotRepository;
import KarmaTute.KarmaTute.entity.*;
import KarmaTute.KarmaTute.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class RecommendationEngine {
    private static final Logger log = LoggerFactory.getLogger(RecommendationEngine.class);
    private static final String ENGINE_VERSION = "rec-v1.0.0";

    private final RecommendationRepository recRepository;
    private final CompetencyGapRepository gapRepository;
    private final CompetencySnapshotRepository snapshotRepository;
    private final CompetencyRepository competencyRepository;
    private final ApplicationEventPublisher events;

    // Curated internal learning catalog (MOCK — real iGOT/NSSTA data would be fetched via adapters)
    private static final List<Map<String, Object>> LEARNING_CATALOG = List.of(
        Map.of("title","Public Policy Analysis Simulation – Gazette Circulars (Mission Karmayogi)","source","iGOT","sourceRef","igot-mky-001","sourceStatus","MOCK","actionType","VOICE_SIM","actionRoute","execution-lab","minutes",8,"tags",List.of("GOVERNANCE","PUBLIC_POLICY")),
        Map.of("title","DPDP Act 2023: Data Fiduciary Obligations (iGOT)","source","iGOT","sourceRef","igot-dpdp-001","sourceStatus","MOCK","actionType","MCQ","actionRoute","execution-lab","minutes",12,"tags",List.of("TECHNICAL","DIGITAL_PRIVACY")),
        Map.of("title","NDQAF Data Quality Execution Assessment","source","iGOT","sourceRef","igot-ndqaf-001","sourceStatus","MOCK","actionType","SCENARIO","actionRoute","execution-lab","minutes",10,"tags",List.of("STATISTICAL","DATA_QUALITY")),
        Map.of("title","Digital Workplace Ethics for Civil Servants (NSSTA)","source","NSSTA","sourceRef","nssta-ethics-001","sourceStatus","MOCK","actionType","MCQ","actionRoute","execution-lab","minutes",6,"tags",List.of("OPERATIONAL","ETHICS")),
        Map.of("title","Citizen Data Handling – Pratyaksha Evidence Collection","source","PRATYAKSHA","sourceRef","pratyaksha-sim-001","sourceStatus","SANDBOX","actionType","SCENARIO","actionRoute","execution-lab","minutes",15,"tags",List.of("GOVERNANCE","CIVIC"))
    );

    public RecommendationEngine(RecommendationRepository recRepository,
                                 CompetencyGapRepository gapRepository,
                                 CompetencySnapshotRepository snapshotRepository,
                                 CompetencyRepository competencyRepository,
                                 ApplicationEventPublisher events) {
        this.recRepository = recRepository;
        this.gapRepository = gapRepository;
        this.snapshotRepository = snapshotRepository;
        this.competencyRepository = competencyRepository;
        this.events = events;
    }

    @Transactional
    public void updateGapAndRegenerateForUser(Long userId, Long compId, double current, double target, double gapVal) {
        log.info("GAP ENGINE UPDATE: user {}, comp {}, current {}, target {}", userId, compId, current, target);
        
        Optional<CompetencyGap> existingGapOpt = gapRepository.findByUserId(userId).stream()
                .filter(g -> g.getCompetency() != null && g.getCompetency().getId().equals(compId))
                .findFirst();

        if (existingGapOpt.isPresent()) {
            CompetencyGap gap = existingGapOpt.get();
            gap.setCurrentLevel((int) current);
            gap.setTargetLevel((int) target);
            gap.setGapPercentage((int) Math.max(0, target - current));
            
            double gapRatio = target > 0 ? ((target - current) / target) : 0;
            String priority = "LOW";
            if (gapRatio > 0.4) priority = "CRITICAL";
            else if (gapRatio > 0.2) priority = "HIGH";
            else if (gapRatio > 0.1) priority = "MEDIUM";
            
            gap.setPriority(priority);
            gap.setStatus((target - current) > 0 ? "OPEN" : "RESOLVED");
            gapRepository.save(gap);
            log.info("Gap updated: {} (Status: {})", gap.getPriority(), gap.getStatus());
        }
        
        regenerateForUser(userId);
    }

    @Transactional
    public List<RecommendationCandidate> regenerateForUser(Long userId) {
        log.info("Regenerating recommendations for user {}", userId);

        // 1. RETRIEVE: get all open gaps ordered by gap magnitude
        List<CompetencyGap> openGaps = gapRepository.findByUserId(userId).stream()
            .filter(g -> "OPEN".equals(g.getStatus()))
            .sorted(Comparator.comparingInt(CompetencyGap::getGapPercentage).reversed())
            .toList();

        if (openGaps.isEmpty()) {
            log.info("No open gaps for user {} — no recommendations generated", userId);
            return List.of();
        }

        // 2. FILTER + MATCH: deterministic score per catalog item vs priority gap
        CompetencyGap priorityGap = openGaps.get(0);
        String domain = priorityGap.getCompetency() != null ? priorityGap.getCompetency().getDomain() : "";

        List<RecommendationCandidate> candidates = new ArrayList<>();
        for (Map<String, Object> item : LEARNING_CATALOG) {
            List<String> tags = (List<String>) item.get("tags");
            boolean tagMatch = tags.stream().anyMatch(t -> t.equalsIgnoreCase(domain));

            // Deterministic scoring
            double rolefit = tagMatch ? 0.9 : 0.3;
            double levelfit = computeLevelFit(priorityGap.getCurrentLevel(), priorityGap.getTargetLevel());
            double providerAvail = "LIVE".equals(item.get("sourceStatus")) ? 1.0 :
                                   "SANDBOX".equals(item.get("sourceStatus")) ? 0.7 : 0.5;
            double matchScore = (rolefit * 0.4) + (levelfit * 0.4) + (providerAvail * 0.2);

            if (matchScore < 0.3) continue; // FILTER: too low match

            // 3. EXPLAIN: build actual factors string — never say "AI selected"
            String factors = String.format(
                "{\"roleFit\":%.2f,\"levelFit\":%.2f,\"providerAvailability\":%.2f,\"domain\":\"%s\",\"competencyGap\":%d%%}",
                rolefit, levelfit, providerAvail, domain, priorityGap.getGapPercentage()
            );
            String whyThis = String.format(
                "Targets your highest-priority gap (%s, %d%% below benchmark). Domain match: %s. " +
                "Estimated time: %d min. Source: %s (%s).",
                priorityGap.getCompetency() != null ? priorityGap.getCompetency().getName() : "Unknown",
                priorityGap.getGapPercentage(), domain,
                (Integer) item.get("minutes"),
                item.get("source"), item.get("sourceStatus")
            );

            RecommendationCandidate cand = RecommendationCandidate.builder()
                .userId(userId)
                .competencyId(priorityGap.getCompetency() != null ? priorityGap.getCompetency().getId() : null)
                .title((String) item.get("title"))
                .description("Addresses: " + domain + " competency gap")
                .source((String) item.get("source"))
                .sourceRef((String) item.get("sourceRef"))
                .sourceStatus((String) item.get("sourceStatus"))
                .estimatedMinutes((Integer) item.get("minutes"))
                .actionType((String) item.get("actionType"))
                .actionRoute((String) item.get("actionRoute"))
                .matchScore(matchScore)
                .rankingFactors(factors)
                .whyThis(whyThis)
                .confidence(matchScore * providerAvail)
                .status("RECOMMENDED")
                .engineVersion(ENGINE_VERSION)
                .generatedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
            candidates.add(cand);
        }

        // 4. RERANK by matchScore
        candidates.sort(Comparator.comparingDouble(RecommendationCandidate::getMatchScore).reversed());

        // 5. PERSIST: clear old RECOMMENDED, save new batch (idempotent)
        recRepository.deleteByUserIdAndStatus(userId, "RECOMMENDED");
        List<RecommendationCandidate> saved = recRepository.saveAll(candidates);

        if (!saved.isEmpty()) {
            events.publishEvent(new RecommendationGeneratedEvent(this, userId, saved.get(0)));
        }
        log.info("Generated {} recommendations for user {}", saved.size(), userId);
        return saved;
    }

    private double computeLevelFit(int current, int target) {
        if (target <= 0) return 0.5;
        double gap = (double)(target - current) / target;
        // Best fit for medium gaps (not too easy, not impossible)
        if (gap > 0.5) return 0.8;
        if (gap > 0.2) return 1.0;
        return 0.4;
    }
}
