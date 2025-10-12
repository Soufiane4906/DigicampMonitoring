package com.digicamp.monitoring.domain.repository;

import com.digicamp.monitoring.domain.model.Role;
import java.util.Optional;

public interface RoleRepository {
    Optional<Role> findByName(String name);
    Role save(Role role);
}