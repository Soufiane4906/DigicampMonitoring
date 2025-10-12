package com.digicamp.monitoring.infrastructure.persistence;

import com.digicamp.monitoring.domain.model.ProjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JpaProjectAssignmentRepository extends JpaRepository<ProjectAssignment, Long> {
    List<ProjectAssignment> findByProjectId(Long projectId);
    List<ProjectAssignment> findByCollaboratorId(Long collaboratorId);
}