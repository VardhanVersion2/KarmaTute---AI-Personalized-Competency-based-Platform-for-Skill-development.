package KarmaTute.KarmaTute.dto;

public class RecentEvidenceDto {
    private Long id;
    private String title;
    private String category;
    private String provenance;
    private Double confidenceScore;
    private String status;
    private String verifiedDateFormatted;

    public RecentEvidenceDto() {}

    public RecentEvidenceDto(Long id, String title, String category, String provenance, Double confidenceScore, String status, String verifiedDateFormatted) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.provenance = provenance;
        this.confidenceScore = confidenceScore;
        this.status = status;
        this.verifiedDateFormatted = verifiedDateFormatted;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getProvenance() { return provenance; }
    public void setProvenance(String provenance) { this.provenance = provenance; }
    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getVerifiedDateFormatted() { return verifiedDateFormatted; }
    public void setVerifiedDateFormatted(String verifiedDateFormatted) { this.verifiedDateFormatted = verifiedDateFormatted; }
}
