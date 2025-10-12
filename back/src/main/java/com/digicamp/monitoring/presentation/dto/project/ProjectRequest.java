package com.digicamp.monitoring.presentation.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ProjectRequest {
    @NotBlank(message = "Project name is required")
    private String name;
    
    private String logoUrl;
    
    // Support pour l'upload Base64 du logo
    private String logoBase64;
    
    private String description;
    private String objectives;
    
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    @NotNull(message = "Status ID is required")
    private Long statusId;
}
