package com.digicamp.monitoring.domain.repository;

import com.digicamp.monitoring.domain.model.Collaborator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface CollaboratorRepository {
    Collaborator save(Collaborator collaborator);
    Optional<Collaborator> findById(Long id);
    List<Collaborator> findAll();
    Page<Collaborator> findAll(Pageable pageable);
    Page<Collaborator> findByAvailable(Boolean available, Pageable pageable);
    Optional<Collaborator> findByEmail(String email);
    void delete(Collaborator collaborator);
    boolean existsById(Long id);
}