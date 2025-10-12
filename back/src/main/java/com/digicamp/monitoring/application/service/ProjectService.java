package com.digicamp.monitoring.application.service;

import com.digicamp.monitoring.domain.model.Project;
import com.digicamp.monitoring.domain.model.ProjectStatus;
import com.digicamp.monitoring.domain.repository.ProjectRepository;
import com.digicamp.monitoring.infrastructure.persistence.JpaProjectStatusRepository;
import com.digicamp.monitoring.presentation.dto.project.ProjectRequest;
import com.digicamp.monitoring.presentation.dto.project.ProjectResponse;
import com.digicamp.monitoring.presentation.dto.project.ProjectStatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final JpaProjectStatusRepository statusRepository;

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
        ProjectStatus status = statusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        Project project = Project.builder()
                .name(request.getName())
                .logoUrl(request.getLogoUrl())
                .description(request.getDescription())
                .objectives(request.getObjectives())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(status)
                .build();

        Project savedProject = projectRepository.save(project);
        return mapToResponse(savedProject);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ProjectStatus status = statusRepository.findById(request.getStatusId())
                .orElseThrow(() -> new RuntimeException("Status not found"));

        project.setName(request.getName());
        project.setLogoUrl(request.getLogoUrl());
        project.setDescription(request.getDescription());
        project.setObjectives(request.getObjectives());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(status);

        Project updatedProject = projectRepository.save(project);
        return mapToResponse(updatedProject);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToResponse(project);
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getAllProjects(Pageable pageable) {
        return projectRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        projectRepository.delete(project);
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .logoUrl(project.getLogoUrl())
                .description(project.getDescription())
                .objectives(project.getObjectives())
                .startDate(project.getStartDate())
                .endDate(project.getEndDate())
                .status(mapStatusToResponse(project.getStatus()))
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    private ProjectStatusResponse mapStatusToResponse(ProjectStatus status) {
        if (status == null) return null;
        return ProjectStatusResponse.builder()
                .id(status.getId())
                .code(status.getCode())
                .label(status.getLabel())
                .color(status.getColor())
                .displayOrder(status.getDisplayOrder())
                .build();
    }
}