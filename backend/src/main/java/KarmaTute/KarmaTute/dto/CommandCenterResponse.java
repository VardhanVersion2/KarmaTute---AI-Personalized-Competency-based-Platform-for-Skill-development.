package KarmaTute.KarmaTute.dto;

import java.util.List;

public class CommandCenterResponse {
    private String state; // success, empty, partial, error, provider-unavailable
    private String stateMessage;
    private UserContextDto userContext;
    private CompetencyPulseDto competencyPulse;
    private PriorityGapDto priorityGap;
    private NextBestActionDto nextBestAction;
    private List<RecentEvidenceDto> recentEvidence;
    private ProgressDto progress;

    public CommandCenterResponse() {}

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getStateMessage() { return stateMessage; }
    public void setStateMessage(String stateMessage) { this.stateMessage = stateMessage; }
    public UserContextDto getUserContext() { return userContext; }
    public void setUserContext(UserContextDto userContext) { this.userContext = userContext; }
    public CompetencyPulseDto getCompetencyPulse() { return competencyPulse; }
    public void setCompetencyPulse(CompetencyPulseDto competencyPulse) { this.competencyPulse = competencyPulse; }
    public PriorityGapDto getPriorityGap() { return priorityGap; }
    public void setPriorityGap(PriorityGapDto priorityGap) { this.priorityGap = priorityGap; }
    public NextBestActionDto getNextBestAction() { return nextBestAction; }
    public void setNextBestAction(NextBestActionDto nextBestAction) { this.nextBestAction = nextBestAction; }
    public List<RecentEvidenceDto> getRecentEvidence() { return recentEvidence; }
    public void setRecentEvidence(List<RecentEvidenceDto> recentEvidence) { this.recentEvidence = recentEvidence; }
    public ProgressDto getProgress() { return progress; }
    public void setProgress(ProgressDto progress) { this.progress = progress; }
}
