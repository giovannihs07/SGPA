package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;

public interface RoleRepository extends CrudRepository<Role, Long> {
    List<Role> findAll();
    Optional<Role> findByName(RoleName name);
}
