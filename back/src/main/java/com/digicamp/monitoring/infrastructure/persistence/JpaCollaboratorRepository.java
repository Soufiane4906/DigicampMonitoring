package com.digicamp.monitoring.infrastructure.persistence;

import com.digicamp.monitoring.domain.model.Collaborator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JpaCollaboratorRepository extends JpaRepository<Collaborator, Long> {
    Page<Collaborator> findByAvailable(Boolean available, Pageable pageable);
    Optional<Collaborator> findByEmail(String email);
}