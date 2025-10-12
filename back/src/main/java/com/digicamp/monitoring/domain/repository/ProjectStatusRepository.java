package com.digicamp.monitoring.domain.repository;

import com.digicamp.monitoring.domain.model.ProjectStatus;
import java.util.List;
import java.util.Optional;

public interface ProjectStatusRepository {
    ProjectStatus save(ProjectStatus status);
    Optional<ProjectStatus> findById(Long id);
    Optional<ProjectStatus> findByCode(String code);
    List<ProjectStatus> findAllOrderByDisplayOrder();
    void delete(ProjectStatus status);
}