package com.digicamp.monitoring.infrastructure.persistence;

import com.digicamp.monitoring.domain.model.Collaborator;
import com.digicamp.monitoring.domain.repository.CollaboratorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CollaboratorRepositoryImpl implements CollaboratorRepository {
    
    private final JpaCollaboratorRepository jpaCollaboratorRepository;

    @Override
    public Collaborator save(Collaborator collaborator) {
        return jpaCollaboratorRepository.save(collaborator);
    }

    @Override
    public Optional<Collaborator> findById(Long id) {
        return jpaCollaboratorRepository.findById(id);
    }

    @Override
    public List<Collaborator> findAll() {
        return jpaCollaboratorRepository.findAll();
    }

    @Override
    public Page<Collaborator> findAll(Pageable pageable) {
        return jpaCollaboratorRepository.findAll(pageable);
    }

    @Override
    public Page<Collaborator> findByAvailable(Boolean available, Pageable pageable) {
        return jpaCollaboratorRepository.findByAvailable(available, pageable);
    }

    @Override
    public Optional<Collaborator> findByEmail(String email) {
        return jpaCollaboratorRepository.findByEmail(email);
    }

    @Override
    public void delete(Collaborator collaborator) {
        jpaCollaboratorRepository.delete(collaborator);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaCollaboratorRepository.existsById(id);
    }
}