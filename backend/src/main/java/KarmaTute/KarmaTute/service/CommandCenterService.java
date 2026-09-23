package KarmaTute.KarmaTute.service;

import KarmaTute.KarmaTute.dto.*;
import KarmaTute.KarmaTute.entity.*;
import KarmaTute.KarmaTute.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommandCenterService {

    private final UserRepository userRepository;
    private final UserCompetencyRepository userCompetencyRepository;
    private final CompetencyGapRepository competencyGapRepository;
    private final NextBestActionRepository nextBestActionRepository;
    private final EvidenceItemRepository evidenceItemRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm 'IST'");

    public CommandCenterService(
        UserRepository userRepository,
        UserCompetencyRepository userCompetencyRepository,
        CompetencyGapRepository competencyGapRepository,
        NextBestActionRepository nextBestActionRepository,
        EvidenceItemRepository evidenceItemRepository
    ) {
        this.userRepository = userRepository;
        this.userCompetencyRepository = userCompetencyRepository;
        this.competencyGapRepository = competencyGapRepository;
        this.nextBestActionRepository = nextBestActionRepository;
        this.evidenceItemRepository = evidenceItemRepository;
    }

    @Transactional(readOnly = true)
    public CommandCenterResponse getCommandCenter(Long userId, String stateOverride) {
        CommandCenterResponse response = new CommandCenterResponse();

        // Check for state overrides for testing or simulation
        if (stateOverride != null && !stateOverride.isBlank()) {
            String norm = stateOverride.toLowerCase().trim();
            if (norm.equals("empty")) {
                response.setState("empty");
                response.setStateMessage("No profile or competency history found. Complete onboarding to initialize your command center.");
                return response;
            }
            if (norm.equals("error")) {
                response.setState("error");
                response.setStateMessage("Failed to retrieve command center telemetry from upstream database cluster.");
                return response;
            }
            if (norm.equals("provider-unavailable")) {
                response.setState("provider-unavailable");
                response.setStateMessage("AI Gateway and iGOT synchronization services are temporarily offline. Displaying cached local ledger.");
                // Populate basic context but with provider-unavailable state
            }
        }

        // 1. Resolve User
        Optional<User> userOpt = (userId != null)
            ? userRepository.findById(userId)
            : userRepository.findAll().stream().findFirst();

        if (userOpt.isEmpty()) {
            response.setState("empty");
            response.setStateMessage("No active learner profile found. Please register to begin.");
            return response;
        }

        User user = userOpt.get();

        // User Context
        response.setUserContext(new UserContextDto(
            user.getId(),
            user.getFullName(),
            user.getRole(),
            user.getDepartment(),
            user.getDesignation(),
            user.getTargetRole()
        ));

        // 2. Competencies & Pulse
        List<UserCompetency> userComps = userCompetencyRepository.findByUserId(user.getId());
        int totalComps = userComps.size();
        int sumScore = 0;
        int verifiedCount = 0;

        for (UserCompetency uc : userComps) {
            sumScore += (uc.getCurrentLevel() != null ? uc.getCurrentLevel() : 0);
            if (uc.isVerified()) {
                verifiedCount++;
            }
        }

        int avgMastery = totalComps > 0 ? (sumScore / totalComps) : 0;

        // 3. Priority Gap
        Optional<CompetencyGap> priorityGapOpt = competencyGapRepository
            .findFirstByUserIdAndStatusOrderByGapPercentageDesc(user.getId(), "OPEN");

        if (priorityGapOpt.isPresent()) {
            CompetencyGap gap = priorityGapOpt.get();
            response.setPriorityGap(new PriorityGapDto(
                gap.getCompetency().getId(),
                gap.getCompetency().getName(),
                gap.getCompetency().getDomain(),
                gap.getCurrentLevel(),
                gap.getTargetLevel(),
                gap.getGapPercentage(),
                gap.getPriority()
            ));
        }

        // Pulse
        List<CompetencyGap> allGaps = competencyGapRepository.findByUserId(user.getId());
        long resolvedGaps = allGaps.stream().filter(g -> "RESOLVED".equals(g.getStatus())).count();
        int resolutionProgress = allGaps.isEmpty() ? 100 : (int) ((resolvedGaps * 100) / allGaps.size());

        response.setCompetencyPulse(new CompetencyPulseDto(
            avgMastery,
            verifiedCount,
            totalComps,
            resolutionProgress,
            avgMastery >= 75 ? "EXEMPLARY" : avgMastery >= 50 ? "PROGRESSING" : "ATTENTION_REQUIRED"
        ));

        // 4. Next Best Action
        Optional<NextBestAction> actionOpt = nextBestActionRepository
            .findFirstByUserIdAndStatus(user.getId(), "RECOMMENDED");

        if (actionOpt.isPresent()) {
            NextBestAction nba = actionOpt.get();
            response.setNextBestAction(new NextBestActionDto(
                nba.getId(),
                nba.getTitle(),
                nba.getDescription(),
                nba.getWhyThis(),
                nba.getActionType(),
                nba.getEstimatedMinutes(),
                nba.getActionRoute()
            ));
        }

        // 5. Recent Evidence
        List<EvidenceItem> evidenceList = evidenceItemRepository.findByUserIdOrderByVerifiedAtDesc(user.getId());
        List<RecentEvidenceDto> evidenceDtos = new ArrayList<>();
        for (EvidenceItem item : evidenceList) {
            evidenceDtos.add(new RecentEvidenceDto(
                item.getId(),
                item.getTitle(),
                item.getCategory(),
                item.getProvenance(),
                item.getConfidenceScore(),
                item.getStatus(),
                item.getVerifiedAt() != null ? item.getVerifiedAt().format(DATE_FORMATTER) : "Pending"
            ));
        }
        response.setRecentEvidence(evidenceDtos);

        // 6. Overall Progress
        response.setProgress(new ProgressDto(
            resolutionProgress,
            (int) resolvedGaps,
            allGaps.size(),
            14 // 14-day continuous learning streak
        ));

        if (response.getState() == null) {
            if ("partial".equalsIgnoreCase(stateOverride)) {
                response.setState("partial");
                response.setStateMessage("Evidence processing queue has 1 pending document awaiting TPAC confirmation.");
            } else {
                response.setState("success");
                response.setStateMessage("Real-time competency matrix synchronized with national training frameworks.");
            }
        }

        return response;
    }
}
