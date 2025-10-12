package com.digicamp.monitoring.presentation.dto.project;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class ProjectResponse {
    private Long id;
    private String name;
    private String logoUrl;
    private String description;
    private String objectives;
    private LocalDate startDate;
    private LocalDate endDate;
    private ProjectStatusResponse status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}