package KarmaTute.KarmaTute.service;

import KarmaTute.KarmaTute.competency.CompetencyUpdatedEvent;
import KarmaTute.KarmaTute.recommendation.RecommendationEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Service
public class ClosedLoopService {
    private static final Logger log = LoggerFactory.getLogger(ClosedLoopService.class);
    private final RecommendationEngine recommendationEngine;

    public ClosedLoopService(RecommendationEngine recommendationEngine) {
        this.recommendationEngine = recommendationEngine;
    }

    @EventListener
    public void onCompetencyUpdated(CompetencyUpdatedEvent event) {
        Long userId = event.getSnapshot().getUserId();
        Long compId = event.getSnapshot().getCompetencyId();
        double current = event.getSnapshot().getCurrent();
        double target = event.getSnapshot().getTarget();
        double gapVal = event.getSnapshot().getGap();

        log.info("CLOSED LOOP TRIGGERED: Competency updated for user {}. Updating gaps...", userId);
        
        // Let recommendationEngine or a GapEngine handle gap updates, or we can just emit an event.
        // Wait, GapEngine does not exist. Let's create it via a script or just keep it simple: 
        // We will call recommendationEngine.updateGapsAndRegenerate(userId, compId, current, target)
        
        recommendationEngine.updateGapAndRegenerateForUser(userId, compId, current, target, gapVal);
    }
}
