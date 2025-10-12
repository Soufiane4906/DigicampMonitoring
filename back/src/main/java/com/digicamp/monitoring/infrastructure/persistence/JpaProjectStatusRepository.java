package com.digicamp.monitoring.infrastructure.persistence;

import com.digicamp.monitoring.domain.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface JpaProjectStatusRepository extends JpaRepository<ProjectStatus, Long> {
    Optional<ProjectStatus> findByCode(String code);
    
    @Query("SELECT ps FROM ProjectStatus ps ORDER BY ps.displayOrder")
    List<ProjectStatus> findAllOrderByDisplayOrder();
}