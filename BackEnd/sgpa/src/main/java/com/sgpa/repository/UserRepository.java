package com.sgpa.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.sgpa.model.users.User;

public interface UserRepository extends CrudRepository<User, Long>{
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByPersonaId(Long personaId);
};
