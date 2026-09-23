package KarmaTute.KarmaTute.recommendation;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class RecommendationGeneratedEvent extends ApplicationEvent {
    private final Long userId;
    private final RecommendationCandidate topCandidate;
    public RecommendationGeneratedEvent(Object source, Long userId, RecommendationCandidate topCandidate) {
        super(source);
        this.userId = userId;
        this.topCandidate = topCandidate;
    }
}
