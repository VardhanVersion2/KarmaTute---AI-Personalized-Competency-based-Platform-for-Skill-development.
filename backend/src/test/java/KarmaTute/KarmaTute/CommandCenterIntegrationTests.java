package KarmaTute.KarmaTute;

import KarmaTute.KarmaTute.dto.CommandCenterResponse;
import KarmaTute.KarmaTute.entity.*;
import KarmaTute.KarmaTute.repository.*;
import KarmaTute.KarmaTute.service.CommandCenterService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class CommandCenterIntegrationTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CompetencyRepository competencyRepository;

    @Autowired
    private CompetencyGapRepository competencyGapRepository;

    @Autowired
    private NextBestActionRepository nextBestActionRepository;

    @Autowired
    private CommandCenterService commandCenterService;

    @Test
    @DisplayName("1. Test Profile Exists: Verifies user profile state is initialized in database")
    void testProfileExists() {
        List<User> users = userRepository.findAll();
        assertFalse(users.isEmpty(), "User repository must not be empty");

        User user = users.get(0);
        assertNotNull(user.getId(), "User ID must exist");
        assertNotNull(user.getFullName(), "User full name must exist");
        assertEquals("ROLE_LEARNER", user.getRole(), "User role must be ROLE_LEARNER");
        assertNotNull(user.getTargetRole(), "Target role must be defined for career progression");
    }

    @Test
    @DisplayName("2. Test Competency Exists: Verifies standard competency catalog is populated")
    void testCompetencyExists() {
        List<Competency> competencies = competencyRepository.findAll();
        assertTrue(competencies.size() >= 4, "Must have at least 4 national competencies seeded");

        Optional<Competency> govComp = competencyRepository.findByCode("COMP-GOV-01");
        assertTrue(govComp.isPresent(), "Government Circular analysis competency must exist");
        assertEquals("GOVERNANCE", govComp.get().getDomain());
        assertTrue(govComp.get().getBenchmarkLevel() > 0);
    }

    @Test
    @DisplayName("3. Test Gap Exists: Verifies gap computation reflects target vs current level")
    void testGapExists() {
        List<User> users = userRepository.findAll();
        assertFalse(users.isEmpty());
        User user = users.get(0);

        List<CompetencyGap> gaps = competencyGapRepository.findByUserId(user.getId());
        assertFalse(gaps.isEmpty(), "Competency gaps must exist for learner");

        Optional<CompetencyGap> priorityGap = competencyGapRepository
            .findFirstByUserIdAndStatusOrderByGapPercentageDesc(user.getId(), "OPEN");
        assertTrue(priorityGap.isPresent(), "Priority open gap must exist");
        assertTrue(priorityGap.get().getGapPercentage() > 0, "Gap percentage must be positive");
        assertEquals("HIGH", priorityGap.get().getPriority());
    }

    @Test
    @DisplayName("4. Test Recommendation Exists: Verifies Next Best Action is derived with 'Why this?' reasoning")
    void testRecommendationExists() {
        List<User> users = userRepository.findAll();
        assertFalse(users.isEmpty());
        User user = users.get(0);

        Optional<NextBestAction> actionOpt = nextBestActionRepository.findFirstByUserIdAndStatus(user.getId(), "RECOMMENDED");
        assertTrue(actionOpt.isPresent(), "Next Best Action recommendation must exist");

        NextBestAction nba = actionOpt.get();
        assertNotNull(nba.getTitle(), "Recommendation title must not be null");
        assertNotNull(nba.getWhyThis(), "Recommendation must explicitly state 'Why this?'");
        assertTrue(nba.getWhyThis().length() > 20, "'Why this?' rationale must be descriptive and grounded");
        assertEquals("execution-lab", nba.getActionRoute(), "Next action route must point to execution-lab");
    }

    @Test
    @DisplayName("5. Test Composed Read Model: Verifies GET /me/command-center composed payload")
    void testComposedReadModel() {
        CommandCenterResponse response = commandCenterService.getCommandCenter(null, null);

        assertNotNull(response);
        assertEquals("success", response.getState());
        assertNotNull(response.getUserContext(), "User context must be present in composed read model");
        assertNotNull(response.getCompetencyPulse(), "Competency pulse must be present");
        assertNotNull(response.getPriorityGap(), "Priority gap must be present");
        assertNotNull(response.getNextBestAction(), "Next Best Action must be present");
        assertNotNull(response.getRecentEvidence(), "Recent evidence must be present");
        assertFalse(response.getRecentEvidence().isEmpty(), "Recent evidence list must not be empty");
        assertNotNull(response.getProgress(), "Progress metrics must be present");
    }

    @Test
    @DisplayName("6. Test Required State Transitions: Verifies empty, partial, and provider-unavailable read states")
    void testRequiredStates() {
        CommandCenterResponse emptyState = commandCenterService.getCommandCenter(null, "empty");
        assertEquals("empty", emptyState.getState());
        assertNotNull(emptyState.getStateMessage());

        CommandCenterResponse partialState = commandCenterService.getCommandCenter(null, "partial");
        assertEquals("partial", partialState.getState());
        assertNotNull(partialState.getUserContext());

        CommandCenterResponse providerUnavailable = commandCenterService.getCommandCenter(null, "provider-unavailable");
        assertEquals("provider-unavailable", providerUnavailable.getState());
        assertNotNull(providerUnavailable.getStateMessage());
    }
}
