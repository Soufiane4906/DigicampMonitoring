package com.digicamp.monitoring.infrastructure.persistence;

import com.digicamp.monitoring.domain.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByStatusId(Long statusId, Pageable pageable);
}