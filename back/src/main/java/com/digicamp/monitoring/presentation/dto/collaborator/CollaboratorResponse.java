package com.digicamp.monitoring.presentation.dto.collaborator;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CollaboratorResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String grade;
    private String position;
    private String site;
    private String skills;
    private Boolean available;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}