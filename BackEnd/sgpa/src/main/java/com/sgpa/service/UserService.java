package com.sgpa.service;

import java.util.List;
import java.util.Optional;

import com.sgpa.dto.request.UserRequest;
import com.sgpa.dto.response.UserResponse;

public interface UserService {
    // Implementación de los métodos de esta interface
    List<UserResponse> findAll();

    Optional<UserResponse> findById(Long id);

    UserResponse save(UserRequest user);

    Optional<UserResponse> update(UserRequest request, Long id);

    void remove(Long id);
}
