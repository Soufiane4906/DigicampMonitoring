package com.digicamp.monitoring.domain.repository;

import com.digicamp.monitoring.domain.model.ProjectAssignment;
import java.util.List;
import java.util.Optional;

public interface ProjectAssignmentRepository {
    ProjectAssignment save(ProjectAssignment assignment);
    Optional<ProjectAssignment> findById(Long id);
    List<ProjectAssignment> findByProjectId(Long projectId);
    List<ProjectAssignment> findByCollaboratorId(Long collaboratorId);
    void delete(ProjectAssignment assignment);
}