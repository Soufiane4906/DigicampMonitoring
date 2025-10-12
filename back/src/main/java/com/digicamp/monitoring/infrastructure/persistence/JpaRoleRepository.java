package com.digicamp.monitoring.infrastructure.persistence;

import com.digicamp.monitoring.domain.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface JpaRoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}