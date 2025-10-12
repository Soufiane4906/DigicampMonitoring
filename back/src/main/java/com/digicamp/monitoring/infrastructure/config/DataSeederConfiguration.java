package com.digicamp.monitoring.infrastructure.config;

import com.digicamp.monitoring.domain.model.*;
import com.digicamp.monitoring.domain.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeederConfiguration {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ProjectStatusRepository projectStatusRepository;
    private final ProjectRepository projectRepository;
    private final CollaboratorRepository collaboratorRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Order(1)
    public CommandLineRunner seedDatabase() {
        return args -> {
            log.info("🌱 Starting database seeding...");

            // 1. Seed Roles
            if (roleRepository.count() == 0) {
                log.info("📝 Seeding roles...");
                Role roleEM = Role.builder().name("EM").description("Engineering Manager").build();
                Role roleUser = Role.builder().name("USER").description("Regular User").build();
                roleRepository.saveAll(Arrays.asList(roleEM, roleUser));
                log.info("✅ Roles seeded successfully");
            }

            // 2. Seed Users
            if (userRepository.count() == 0) {
                log.info("👤 Seeding users...");
                
                Role roleEM = roleRepository.findByName("EM")
                        .orElseThrow(() -> new RuntimeException("Role EM not found"));
                Role roleUser = roleRepository.findByName("USER")
                        .orElseThrow(() -> new RuntimeException("Role USER not found"));

                // Admin user
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .email("admin@digicamp.com")
                        .role(roleEM)
                        .build();

                // Regular users
                User user1 = User.builder()
                        .username("soufiane")
                        .password(passwordEncoder.encode("soufiane123"))
                        .email("soufiane@digicamp.com")
                        .role(roleUser)
                        .build();

                User user2 = User.builder()
                        .username("mohammed")
                        .password(passwordEncoder.encode("mohammed123"))
                        .email("mohammed@digicamp.com")
                        .role(roleUser)
                        .build();

                userRepository.saveAll(Arrays.asList(admin, user1, user2));
                log.info("✅ Users seeded successfully (admin/admin123, soufiane/soufiane123, mohammed/mohammed123)");
            }

            // 3. Seed Project Statuses
            if (projectStatusRepository.count() == 0) {
                log.info("📊 Seeding project statuses...");
                
                ProjectStatus enCours = ProjectStatus.builder()
                        .value("EN_COURS")
                        .label("En cours")
                        .color("#2196F3")
                        .build();

                ProjectStatus termine = ProjectStatus.builder()
                        .value("TERMINE")
                        .label("Terminé")
                        .color("#4CAF50")
                        .build();

                ProjectStatus enPause = ProjectStatus.builder()
                        .value("EN_PAUSE")
                        .label("En pause")
                        .color("#FF9800")
                        .build();

                ProjectStatus annule = ProjectStatus.builder()
                        .value("ANNULE")
                        .label("Annulé")
                        .color("#F44336")
                        .build();

                ProjectStatus planifie = ProjectStatus.builder()
                        .value("PLANIFIE")
                        .label("Planifié")
                        .color("#9C27B0")
                        .build();

                projectStatusRepository.saveAll(Arrays.asList(
                        enCours, termine, enPause, annule, planifie
                ));
                log.info("✅ Project statuses seeded successfully");
            }

            // 4. Seed Collaborators
            if (collaboratorRepository.count() == 0) {
                log.info("👥 Seeding collaborators...");

                Collaborator collab1 = Collaborator.builder()
                        .firstName("Soufiane")
                        .lastName("EL AMRANI")
                        .email("soufiane.elamrani@digicamp.com")
                        .phone("+212 6 12 34 56 78")
                        .grade("B2")
                        .position("Développeur Full Stack")
                        .site("Casa")
                        .skills("Java, Spring Boot, Angular, TypeScript, SQL Server")
                        .available(true)
                        .build();

                Collaborator collab2 = Collaborator.builder()
                        .firstName("Mohammed")
                        .lastName("BENALI")
                        .email("mohammed.benali@digicamp.com")
                        .phone("+212 6 23 45 67 89")
                        .grade("B3")
                        .position("Tech Lead")
                        .site("Rabat")
                        .skills("Java, Spring Boot, Microservices, Docker, Kubernetes")
                        .available(true)
                        .build();

                Collaborator collab3 = Collaborator.builder()
                        .firstName("Fatima")
                        .lastName("ZAHRA")
                        .email("fatima.zahra@digicamp.com")
                        .phone("+212 6 34 56 78 90")
                        .grade("B1")
                        .position("Product Owner")
                        .site("Casa")
                        .skills("Agile, Scrum, JIRA, Product Management")
                        .available(true)
                        .build();

                Collaborator collab4 = Collaborator.builder()
                        .firstName("Youssef")
                        .lastName("IDRISSI")
                        .email("youssef.idrissi@digicamp.com")
                        .phone("+212 6 45 67 89 01")
                        .grade("C1")
                        .position("Scrum Master")
                        .site("Rabat")
                        .skills("Scrum, Agile, Coaching, JIRA, Confluence")
                        .available(true)
                        .build();

                Collaborator collab5 = Collaborator.builder()
                        .firstName("Amina")
                        .lastName("TAHIRI")
                        .email("amina.tahiri@digicamp.com")
                        .phone("+212 6 56 78 90 12")
                        .grade("B2")
                        .position("QA Engineer")
                        .site("Indifférent")
                        .skills("Selenium, JUnit, TestNG, Automation, API Testing")
                        .available(false)
                        .build();

                Collaborator collab6 = Collaborator.builder()
                        .firstName("Karim")
                        .lastName("ALAOUI")
                        .email("karim.alaoui@digicamp.com")
                        .phone("+212 6 67 89 01 23")
                        .grade("A5")
                        .position("Développeur Frontend")
                        .site("Casa")
                        .skills("Angular, React, TypeScript, HTML5, CSS3, PrimeNG")
                        .available(true)
                        .build();

                collaboratorRepository.saveAll(Arrays.asList(
                        collab1, collab2, collab3, collab4, collab5, collab6
                ));
                log.info("✅ Collaborators seeded successfully (6 collaborators)");
            }

            // 5. Seed Projects
            if (projectRepository.count() == 0) {
                log.info("📁 Seeding projects...");

                ProjectStatus enCours = projectStatusRepository.findByValue("EN_COURS")
                        .orElseThrow(() -> new RuntimeException("Status EN_COURS not found"));
                ProjectStatus termine = projectStatusRepository.findByValue("TERMINE")
                        .orElseThrow(() -> new RuntimeException("Status TERMINE not found"));
                ProjectStatus planifie = projectStatusRepository.findByValue("PLANIFIE")
                        .orElseThrow(() -> new RuntimeException("Status PLANIFIE not found"));

                Project project1 = Project.builder()
                        .name("DigicampMonitoring")
                        .description("Plateforme web de gestion des projets et ressources pour le périmètre Digicamp")
                        .objectives("<h3>Objectifs du projet</h3><ul><li>Centraliser la gestion des projets</li><li>Optimiser l'allocation des ressources</li><li>Générer des newsletters automatiques</li></ul>")
                        .startDate(LocalDate.of(2025, 1, 15))
                        .endDate(LocalDate.of(2025, 6, 30))
                        .status(enCours)
                        .build();

                Project project2 = Project.builder()
                        .name("API Gateway Microservices")
                        .description("Mise en place d'une architecture microservices avec API Gateway")
                        .objectives("<h3>Objectifs</h3><ul><li>Architecture scalable</li><li>Gestion centralisée des APIs</li><li>Sécurité renforcée</li></ul>")
                        .startDate(LocalDate.of(2024, 10, 1))
                        .endDate(LocalDate.of(2025, 3, 31))
                        .status(enCours)
                        .build();

                Project project3 = Project.builder()
                        .name("Mobile Banking App")
                        .description("Application mobile de banque digitale")
                        .objectives("<h3>Features</h3><ul><li>Consultation de comptes</li><li>Virements instantanés</li><li>Paiements mobile</li></ul>")
                        .startDate(LocalDate.of(2024, 6, 1))
                        .endDate(LocalDate.of(2024, 12, 31))
                        .status(termine)
                        .build();

                Project project4 = Project.builder()
                        .name("Cloud Migration")
                        .description("Migration des applications vers le Cloud Azure")
                        .objectives("<h3>Objectifs</h3><ul><li>Réduire les coûts infrastructure</li><li>Augmenter la disponibilité</li><li>Scalabilité automatique</li></ul>")
                        .startDate(LocalDate.of(2025, 4, 1))
                        .endDate(LocalDate.of(2025, 12, 31))
                        .status(planifie)
                        .build();

                projectRepository.saveAll(Arrays.asList(
                        project1, project2, project3, project4
                ));
                log.info("✅ Projects seeded successfully (4 projects)");
            }

            log.info("🎉 Database seeding completed successfully!");
            log.info("📋 Summary:");
            log.info("   - Users: {}", userRepository.count());
            log.info("   - Roles: {}", roleRepository.count());
            log.info("   - Project Statuses: {}", projectStatusRepository.count());
            log.info("   - Collaborators: {}", collaboratorRepository.count());
            log.info("   - Projects: {}", projectRepository.count());
            log.info("");
            log.info("🔑 Test Credentials:");
            log.info("   Admin: admin / admin123");
            log.info("   User 1: soufiane / soufiane123");
            log.info("   User 2: mohammed / mohammed123");
        };
    }
}
