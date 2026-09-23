package KarmaTute.KarmaTute.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "competencies")
public class Competency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private String name;
    private String domain;
    @Column(length = 1000)
    private String description;
    private Integer benchmarkLevel;

    public Competency() {}

    public Competency(String code, String name, String domain, String description, Integer benchmarkLevel) {
        this.code = code;
        this.name = name;
        this.domain = domain;
        this.description = description;
        this.benchmarkLevel = benchmarkLevel;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDomain() { return domain; }
    public void setDomain(String domain) { this.domain = domain; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getBenchmarkLevel() { return benchmarkLevel; }
    public void setBenchmarkLevel(Integer benchmarkLevel) { this.benchmarkLevel = benchmarkLevel; }
}
