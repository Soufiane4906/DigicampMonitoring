package com.digicamp.monitoring.presentation.dto.collaborator;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CollaboratorRequest {
    @NotBlank(message = "First name is required")
    private String firstName;
    
    @NotBlank(message = "Last name is required")
    private String lastName;
    
    @Email(message = "Email should be valid")
    private String email;
    
    private String phone;
    private String grade;
    private String position;
    private String site;
    private String skills;
    private Boolean available = true;
}