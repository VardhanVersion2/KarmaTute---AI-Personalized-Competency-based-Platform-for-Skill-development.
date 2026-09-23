package KarmaTute.KarmaTute.competency;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

@Getter
public class CompetencyUpdatedEvent extends ApplicationEvent {
    private final CompetencySnapshot snapshot;

    public CompetencyUpdatedEvent(Object source, CompetencySnapshot snapshot) {
        super(source);
        this.snapshot = snapshot;
    }
}