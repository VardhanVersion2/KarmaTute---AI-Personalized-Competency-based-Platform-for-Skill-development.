package KarmaTute.KarmaTute.dto;

public class SubmitOCRRequest {
    private String simulatedExtractedText;
    private Double simulatedConfidence;

    public String getSimulatedExtractedText() { return simulatedExtractedText; }
    public void setSimulatedExtractedText(String simulatedExtractedText) { this.simulatedExtractedText = simulatedExtractedText; }
    public Double getSimulatedConfidence() { return simulatedConfidence; }
    public void setSimulatedConfidence(Double simulatedConfidence) { this.simulatedConfidence = simulatedConfidence; }
}