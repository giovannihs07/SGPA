package com.sgpa.backend.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.sgpa.backend.model.users.Role;

public interface RoleRepository extends CrudRepository<Role, Long> {
    Optional<Role> findByName(String name);
}
