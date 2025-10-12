package com.digicamp.monitoring.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_needs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectNeed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "skill_required", nullable = false, length = 100)
    private String skillRequired;

    @Column(name = "grade_required", length = 100)
    private String gradeRequired;

    @Column(nullable = false)
    private Integer quantity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Boolean fulfilled = false;
}
