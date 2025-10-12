package com.digicamp.monitoring.application.service;

import com.digicamp.monitoring.domain.model.Collaborator;
import com.digicamp.monitoring.domain.repository.CollaboratorRepository;
import com.digicamp.monitoring.presentation.dto.collaborator.CollaboratorRequest;
import com.digicamp.monitoring.presentation.dto.collaborator.CollaboratorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CollaboratorService {

    private final CollaboratorRepository collaboratorRepository;

    @Transactional
    public CollaboratorResponse createCollaborator(CollaboratorRequest request) {
        Collaborator collaborator = Collaborator.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .grade(request.getGrade())
                .position(request.getPosition())
                .site(request.getSite())
                .skills(request.getSkills())
                .available(request.getAvailable())
                .build();

        Collaborator savedCollaborator = collaboratorRepository.save(collaborator);
        return mapToResponse(savedCollaborator);
    }

    @Transactional
    public CollaboratorResponse updateCollaborator(Long id, CollaboratorRequest request) {
        Collaborator collaborator = collaboratorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collaborator not found"));

        collaborator.setFirstName(request.getFirstName());
        collaborator.setLastName(request.getLastName());
        collaborator.setEmail(request.getEmail());
        collaborator.setPhone(request.getPhone());
        collaborator.setGrade(request.getGrade());
        collaborator.setPosition(request.getPosition());
        collaborator.setSite(request.getSite());
        collaborator.setSkills(request.getSkills());
        collaborator.setAvailable(request.getAvailable());

        Collaborator updatedCollaborator = collaboratorRepository.save(collaborator);
        return mapToResponse(updatedCollaborator);
    }

    @Transactional(readOnly = true)
    public CollaboratorResponse getCollaborator(Long id) {
        Collaborator collaborator = collaboratorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collaborator not found"));
        return mapToResponse(collaborator);
    }

    @Transactional(readOnly = true)
    public Page<CollaboratorResponse> getAllCollaborators(Pageable pageable) {
        return collaboratorRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<CollaboratorResponse> getAvailableCollaborators(Pageable pageable) {
        return collaboratorRepository.findByAvailable(true, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public void deleteCollaborator(Long id) {
        Collaborator collaborator = collaboratorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collaborator not found"));
        collaboratorRepository.delete(collaborator);
    }

    private CollaboratorResponse mapToResponse(Collaborator collaborator) {
        return CollaboratorResponse.builder()
                .id(collaborator.getId())
                .firstName(collaborator.getFirstName())
                .lastName(collaborator.getLastName())
                .email(collaborator.getEmail())
                .phone(collaborator.getPhone())
                .grade(collaborator.getGrade())
                .position(collaborator.getPosition())
                .site(collaborator.getSite())
                .skills(collaborator.getSkills())
                .available(collaborator.getAvailable())
                .createdAt(collaborator.getCreatedAt())
                .updatedAt(collaborator.getUpdatedAt())
                .build();
    }
}