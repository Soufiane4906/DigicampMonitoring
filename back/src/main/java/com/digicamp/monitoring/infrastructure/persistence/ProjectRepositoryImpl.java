package com.digicamp.monitoring.infrastructure.persistence;

import com.digicamp.monitoring.domain.model.Project;
import com.digicamp.monitoring.domain.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ProjectRepositoryImpl implements ProjectRepository {
    
    private final JpaProjectRepository jpaProjectRepository;

    @Override
    public Project save(Project project) {
        return jpaProjectRepository.save(project);
    }

    @Override
    public Optional<Project> findById(Long id) {
        return jpaProjectRepository.findById(id);
    }

    @Override
    public List<Project> findAll() {
        return jpaProjectRepository.findAll();
    }

    @Override
    public Page<Project> findAll(Pageable pageable) {
        return jpaProjectRepository.findAll(pageable);
    }

    @Override
    public Page<Project> findByStatusId(Long statusId, Pageable pageable) {
        return jpaProjectRepository.findByStatusId(statusId, pageable);
    }

    @Override
    public void delete(Project project) {
        jpaProjectRepository.delete(project);
    }

    @Override
    public boolean existsById(Long id) {
        return jpaProjectRepository.existsById(id);
    }
}