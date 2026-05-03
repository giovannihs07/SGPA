package com.sgpa.backend.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.sgpa.backend.model.users.User;

public interface UserRepository extends CrudRepository<User, Long>{
    Optional<User> findByEmail(String email);
};
