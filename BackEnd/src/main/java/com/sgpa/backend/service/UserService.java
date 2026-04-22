package com.sgpa.backend.service;

import java.util.List;
import java.util.Optional;

import com.sgpa.backend.dto.request.UserRequest;
import com.sgpa.backend.model.User;

public interface UserService {
    // Implementación de los métodos de esta interface
    List<User> findAll();

    Optional<User> findById(Long id);

    User save(UserRequest user);

    Optional<User> update(UserRequest request, Long id);

    void remove(Long id);
}
