package com.digicamp.monitoring.presentation.dto.project;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProjectStatusResponse {
    private Long id;
    private String code;
    private String label;
    private String color;
    private Integer displayOrder;
}