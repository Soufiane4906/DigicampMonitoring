package com.digicamp.monitoring.domain.repository;

import com.digicamp.monitoring.domain.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface ProjectRepository {
    Project save(Project project);
    Optional<Project> findById(Long id);
    List<Project> findAll();
    Page<Project> findAll(Pageable pageable);
    Page<Project> findByStatusId(Long statusId, Pageable pageable);
    void delete(Project project);
    boolean existsById(Long id);
}