package KarmaTute.KarmaTute.dto;

public class UserContextDto {
    private Long id;
    private String fullName;
    private String role;
    private String department;
    private String designation;
    private String targetRole;

    public UserContextDto() {}

    public UserContextDto(Long id, String fullName, String role, String department, String designation, String targetRole) {
        this.id = id;
        this.fullName = fullName;
        this.role = role;
        this.department = department;
        this.designation = designation;
        this.targetRole = targetRole;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public String getTargetRole() { return targetRole; }
    public void setTargetRole(String targetRole) { this.targetRole = targetRole; }
}
