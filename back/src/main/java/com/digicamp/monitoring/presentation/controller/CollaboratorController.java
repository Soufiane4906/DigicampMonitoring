package com.digicamp.monitoring.presentation.controller;

import com.digicamp.monitoring.application.service.CollaboratorService;
import com.digicamp.monitoring.presentation.dto.collaborator.CollaboratorRequest;
import com.digicamp.monitoring.presentation.dto.collaborator.CollaboratorResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/collaborators")
@RequiredArgsConstructor
public class CollaboratorController {

    private final CollaboratorService collaboratorService;

    @PostMapping
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<CollaboratorResponse> createCollaborator(
            @Valid @RequestBody CollaboratorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(collaboratorService.createCollaborator(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<CollaboratorResponse> updateCollaborator(
            @PathVariable Long id,
            @Valid @RequestBody CollaboratorRequest request) {
        return ResponseEntity.ok(collaboratorService.updateCollaborator(id, request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<CollaboratorResponse> getCollaborator(@PathVariable Long id) {
        return ResponseEntity.ok(collaboratorService.getCollaborator(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<Page<CollaboratorResponse>> getAllCollaborators(Pageable pageable) {
        return ResponseEntity.ok(collaboratorService.getAllCollaborators(pageable));
    }

    @GetMapping("/available")
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<Page<CollaboratorResponse>> getAvailableCollaborators(Pageable pageable) {
        return ResponseEntity.ok(collaboratorService.getAvailableCollaborators(pageable));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<Void> deleteCollaborator(@PathVariable Long id) {
        collaboratorService.deleteCollaborator(id);
        return ResponseEntity.noContent().build();
    }
}