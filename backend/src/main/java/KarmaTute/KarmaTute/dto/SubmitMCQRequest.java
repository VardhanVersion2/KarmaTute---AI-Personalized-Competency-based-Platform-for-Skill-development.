package KarmaTute.KarmaTute.dto;

import java.util.Map;

public class SubmitMCQRequest {
    private Map<Long, String> answers; // QuestionId -> Selected Option

    public Map<Long, String> getAnswers() { return answers; }
    public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
}