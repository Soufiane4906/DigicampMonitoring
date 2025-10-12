# 🔌 API Endpoints - État d'Implémentation

## 📊 Vue d'ensemble

| Module | Total | Implémenté | Restant | Progression |
|--------|-------|------------|---------|-------------|
| Authentication | 2 | 2 | 0 | ✅ 100% |
| Projects | 5 | 5 | 0 | ✅ 100% |
| Collaborators | 6 | 6 | 0 | ✅ 100% |
| Files/Upload | 4 | 4 | 0 | ✅ 100% |
| Project Status | 2 | 0 | 2 | ⏳ 0% |
| Project Assignments | 5 | 0 | 5 | ⏳ 0% |
| Project Needs | 5 | 0 | 5 | ⏳ 0% |
| Dashboard/Stats | 3 | 0 | 3 | ⏳ 0% |
| **TOTAL** | **32** | **17** | **15** | **📈 53%** |

---

## ✅ Endpoints Implémentés

### 🔐 Authentication (2/2)

| Méthode | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| POST | `/api/auth/login` | Connexion utilisateur | ✅ |
| POST | `/api/auth/register` | Inscription utilisateur | ✅ |

**Contrôleur:** `AuthController.java`

---

### 📁 Projects (5/5)

| Méthode | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| POST | `/api/projects` | Créer un projet | ✅ |
| PUT | `/api/projects/{id}` | Modifier un projet | ✅ |
| GET | `/api/projects/{id}` | Récupérer un projet | ✅ |
| GET | `/api/projects` | Lister les projets (paginé) | ✅ |
| DELETE | `/api/projects/{id}` | Supprimer un projet | ✅ |

**Contrôleur:** `ProjectController.java`  
**Support:** Upload de logo via `logoBase64` dans ProjectRequest

---

### 👥 Collaborators (6/6)

| Méthode | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| POST | `/api/collaborators` | Créer un collaborateur | ✅ |
| PUT | `/api/collaborators/{id}` | Modifier un collaborateur | ✅ |
| GET | `/api/collaborators/{id}` | Récupérer un collaborateur | ✅ |
| GET | `/api/collaborators` | Lister les collaborateurs (paginé) | ✅ |
| GET | `/api/collaborators/available` | Lister collaborateurs disponibles | ✅ |
| DELETE | `/api/collaborators/{id}` | Supprimer un collaborateur | ✅ |

**Contrôleur:** `CollaboratorController.java`  
**Support:** Upload de photo via `photoBase64` dans CollaboratorRequest

---

### 📸 Files/Upload (4/4)

| Méthode | Endpoint | Description | Status |
|---------|----------|-------------|--------|
| POST | `/api/files/upload/image` | Upload image (multipart) | ✅ |
| POST | `/api/files/upload/base64` | Upload image (base64) | ✅ |
| GET | `/api/files/{directory}/{filename}` | Récupérer une image | ✅ |
| DELETE | `/api/files/{directory}/{filename}` | Supprimer une image | ✅ |

**Contrôleur:** `FileController.java`  
**Service:** `FileStorageServiceImpl.java`

---

## ⏳ Endpoints à Implémenter

### 📊 Project Status (0/2)

| Méthode | Endpoint | Description | Priorité |
|---------|----------|-------------|----------|
| GET | `/api/project-status` | Lister tous les statuts | 🔴 HAUTE |
| POST | `/api/project-status` | Créer un nouveau statut | 🟡 MOYENNE |

**À créer:**
- `ProjectStatusController.java`
- `ProjectStatusService.java`
- `ProjectStatusRequest.java`
- `ProjectStatusResponse.java`

**Exemple de réponse attendue:**
```json
{
  "content": [
    { "id": 1, "value": "EN_COURS", "label": "En cours", "color": "#2196F3" },
    { "id": 2, "value": "TERMINE", "label": "Terminé", "color": "#4CAF50" }
  ]
}
```

---

### 🔗 Project Assignments (0/5)

| Méthode | Endpoint | Description | Priorité |
|---------|----------|-------------|----------|
| POST | `/api/projects/{projectId}/assignments` | Assigner un collaborateur | 🔴 HAUTE |
| GET | `/api/projects/{projectId}/assignments` | Lister les assignations | 🔴 HAUTE |
| PUT | `/api/assignments/{id}` | Modifier une assignation | 🟡 MOYENNE |
| DELETE | `/api/assignments/{id}` | Retirer une assignation | 🔴 HAUTE |
| GET | `/api/collaborators/{collaboratorId}/assignments` | Projets d'un collaborateur | 🟡 MOYENNE |

**À créer:**
- `ProjectAssignmentController.java`
- `ProjectAssignmentService.java`
- `ProjectAssignmentRequest.java`
- `ProjectAssignmentResponse.java`

**Exemple de requête:**
```json
{
  "collaboratorId": 5,
  "role": "Développeur Frontend",
  "allocationPercentage": 50,
  "startDate": "2025-01-15"
}
```

---

### 📋 Project Needs (0/5)

| Méthode | Endpoint | Description | Priorité |
|---------|----------|-------------|----------|
| POST | `/api/projects/{projectId}/needs` | Créer un besoin | 🟡 MOYENNE |
| GET | `/api/projects/{projectId}/needs` | Lister les besoins | 🟡 MOYENNE |
| PUT | `/api/needs/{id}` | Modifier un besoin | 🟢 BASSE |
| DELETE | `/api/needs/{id}` | Supprimer un besoin | 🟢 BASSE |
| GET | `/api/needs/unfulfilled` | Besoins non pourvus | 🟡 MOYENNE |

**À créer:**
- `ProjectNeedController.java`
- `ProjectNeedService.java`
- `ProjectNeedRequest.java`
- `ProjectNeedResponse.java`

**Exemple de requête:**
```json
{
  "skillRequired": "Java/Spring Boot",
  "quantity": 2,
  "allocationPercentage": 100,
  "startDate": "2025-02-01",
  "endDate": "2025-06-30"
}
```

---

### 📈 Dashboard/Statistics (0/3)

| Méthode | Endpoint | Description | Priorité |
|---------|----------|-------------|----------|
| GET | `/api/dashboard/stats` | Statistiques globales | 🔴 HAUTE |
| GET | `/api/dashboard/projects/timeline` | Chronologie des projets | 🟡 MOYENNE |
| GET | `/api/dashboard/collaborators/workload` | Charge de travail | 🔴 HAUTE |

**À créer:**
- `DashboardController.java`
- `DashboardService.java`
- `DashboardStatsResponse.java`

**Exemple de réponse stats:**
```json
{
  "totalProjects": 15,
  "activeProjects": 8,
  "totalCollaborators": 42,
  "availableCollaborators": 12,
  "averageAllocation": 65.5,
  "projectsByStatus": {
    "EN_COURS": 8,
    "TERMINE": 5,
    "PLANIFIE": 2
  }
}
```

---

## 🎯 Plan d'Implémentation Recommandé

### Phase 1 : Gestion des Statuts (Sprint 1)
**Durée estimée:** 1-2 jours

```java
// 1. Créer ProjectStatusController
@RestController
@RequestMapping("/api/project-status")
public class ProjectStatusController {
    
    @GetMapping
    public ResponseEntity<List<ProjectStatusResponse>> getAllStatuses() {
        // Implémentation
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProjectStatusResponse> createStatus(
            @RequestBody @Valid ProjectStatusRequest request) {
        // Implémentation
    }
}
```

**Checklist:**
- [ ] Créer `ProjectStatusController.java`
- [ ] Créer `ProjectStatusService.java`
- [ ] Créer `ProjectStatusRequest.java`
- [ ] Créer `ProjectStatusResponse.java`
- [ ] Ajouter endpoints dans `SecurityConfiguration`
- [ ] Tests unitaires
- [ ] Documentation Swagger

---

### Phase 2 : Gestion des Assignations (Sprint 2)
**Durée estimée:** 3-4 jours

```java
// 1. Créer ProjectAssignmentController
@RestController
@RequestMapping("/api")
public class ProjectAssignmentController {
    
    @PostMapping("/projects/{projectId}/assignments")
    public ResponseEntity<ProjectAssignmentResponse> assignCollaborator(
            @PathVariable Long projectId,
            @RequestBody @Valid ProjectAssignmentRequest request) {
        // Vérifier disponibilité collaborateur
        // Calculer la charge totale
        // Créer l'assignation
    }
    
    @DeleteMapping("/assignments/{id}")
    public ResponseEntity<Void> removeAssignment(@PathVariable Long id) {
        // Libérer le collaborateur
    }
}
```

**Logique métier importante:**
- Vérifier que le collaborateur est disponible
- Calculer la charge totale (ne pas dépasser 100%)
- Mettre à jour `available` du collaborateur si charge = 100%
- Gérer les chevauchements de dates

**Checklist:**
- [ ] Créer `ProjectAssignmentController.java`
- [ ] Créer `ProjectAssignmentService.java`
- [ ] Créer `ProjectAssignmentRequest.java`
- [ ] Créer `ProjectAssignmentResponse.java`
- [ ] Implémenter logique de disponibilité
- [ ] Tests unitaires + tests d'intégration
- [ ] Documentation

---

### Phase 3 : Gestion des Besoins (Sprint 3)
**Durée estimée:** 2-3 jours

```java
// 1. Créer ProjectNeedController
@RestController
@RequestMapping("/api")
public class ProjectNeedController {
    
    @PostMapping("/projects/{projectId}/needs")
    public ResponseEntity<ProjectNeedResponse> createNeed(
            @PathVariable Long projectId,
            @RequestBody @Valid ProjectNeedRequest request) {
        // Créer le besoin
    }
    
    @GetMapping("/needs/unfulfilled")
    public ResponseEntity<Page<ProjectNeedResponse>> getUnfulfilledNeeds(
            Pageable pageable) {
        // Retourner besoins non satisfaits
        // (quantity > assignations actuelles)
    }
}
```

**Checklist:**
- [ ] Créer `ProjectNeedController.java`
- [ ] Créer `ProjectNeedService.java`
- [ ] Créer `ProjectNeedRequest.java`
- [ ] Créer `ProjectNeedResponse.java`
- [ ] Implémenter logique de matching besoins/collaborateurs
- [ ] Tests unitaires
- [ ] Documentation

---

### Phase 4 : Dashboard & Statistiques (Sprint 4)
**Durée estimée:** 3-4 jours

```java
// 1. Créer DashboardController
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getGlobalStats() {
        // Requêtes agrégées pour stats
    }
    
    @GetMapping("/projects/timeline")
    public ResponseEntity<List<ProjectTimelineResponse>> getProjectsTimeline(
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = ISO.DATE) LocalDate endDate) {
        // Retourner projets dans la période
    }
    
    @GetMapping("/collaborators/workload")
    public ResponseEntity<List<CollaboratorWorkloadResponse>> getWorkload() {
        // Calculer charge pour chaque collaborateur
    }
}
```

**Requêtes optimisées nécessaires:**
```java
// Dans ProjectRepository
@Query("""
    SELECT new com.digicamp.monitoring.presentation.dto.dashboard.ProjectsByStatusDTO(
        p.status.value, COUNT(p)
    )
    FROM Project p
    GROUP BY p.status.value
""")
List<ProjectsByStatusDTO> countByStatus();

// Dans CollaboratorRepository
@Query("""
    SELECT new com.digicamp.monitoring.presentation.dto.dashboard.CollaboratorWorkloadDTO(
        c.id, c.firstName, c.lastName,
        COALESCE(SUM(pa.allocationPercentage), 0)
    )
    FROM Collaborator c
    LEFT JOIN c.assignments pa
    WHERE pa.endDate IS NULL OR pa.endDate >= CURRENT_DATE
    GROUP BY c.id, c.firstName, c.lastName
""")
List<CollaboratorWorkloadDTO> getWorkloadStats();
```

**Checklist:**
- [ ] Créer `DashboardController.java`
- [ ] Créer `DashboardService.java`
- [ ] Créer DTOs de réponse (Stats, Timeline, Workload)
- [ ] Optimiser requêtes avec @Query
- [ ] Ajouter cache avec `@Cacheable`
- [ ] Tests unitaires + tests de performance
- [ ] Documentation

---

## 📝 Templates de Code

### Template Controller

```java
package com.digicamp.monitoring.presentation.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/RESOURCE")
@RequiredArgsConstructor
@Slf4j
public class ResourceController {

    private final ResourceService service;

    @PostMapping
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<ResourceResponse> create(
            @Valid @RequestBody ResourceRequest request) {
        log.info("Creating resource: {}", request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<ResourceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<Page<ResourceResponse>> getAll(Pageable pageable) {
        return ResponseEntity.ok(service.getAll(pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<ResourceResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ResourceRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('EM')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Template Service

```java
package com.digicamp.monitoring.application.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository repository;
    private final ResourceMapper mapper;

    @Override
    @Transactional
    public ResourceResponse create(ResourceRequest request) {
        Resource resource = mapper.toEntity(request);
        resource = repository.save(resource);
        log.info("Resource created: {}", resource.getId());
        return mapper.toResponse(resource);
    }

    @Override
    public ResourceResponse getById(Long id) {
        Resource resource = findResourceById(id);
        return mapper.toResponse(resource);
    }

    @Override
    public Page<ResourceResponse> getAll(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toResponse);
    }

    @Override
    @Transactional
    public ResourceResponse update(Long id, ResourceRequest request) {
        Resource resource = findResourceById(id);
        mapper.updateEntity(request, resource);
        resource = repository.save(resource);
        log.info("Resource updated: {}", id);
        return mapper.toResponse(resource);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Resource resource = findResourceById(id);
        repository.delete(resource);
        log.info("Resource deleted: {}", id);
    }

    private Resource findResourceById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resource not found with id: " + id));
    }
}
```

---

## 🔍 Commandes Utiles

### Générer la documentation Swagger
```bash
# Accéder à Swagger UI
http://localhost:8080/swagger-ui/index.html

# Récupérer la spec OpenAPI
http://localhost:8080/v3/api-docs
```

### Tester les endpoints avec cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Créer un projet (avec token)
curl -X POST http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nouveau Projet",
    "description": "Description du projet",
    "startDate": "2025-01-15",
    "statusId": 1
  }'
```

---

## 📚 Prochaines Étapes

1. **Immédiat:** Implémenter Project Status endpoints (2 endpoints, 1-2 jours)
2. **Court terme:** Implémenter Project Assignments (5 endpoints, 3-4 jours)
3. **Moyen terme:** Implémenter Project Needs (5 endpoints, 2-3 jours)
4. **Long terme:** Implémenter Dashboard & Stats (3 endpoints, 3-4 jours)

**Durée totale estimée:** 10-13 jours

---

**Dernière mise à jour:** 12 Octobre 2025  
**Endpoints implémentés:** 17/32 (53%)  
**Documentation:** ✅ IMAGE_UPLOAD_GUIDE.md
