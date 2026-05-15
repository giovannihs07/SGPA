package com.sgpa.service;

import java.util.List;
import java.util.Optional;

import com.sgpa.dto.request.UserRegisterRequest;
import com.sgpa.dto.response.UserLoginResponse;

public interface UserService {
    // Implementación de los métodos de esta interface
    List<UserLoginResponse> findAll();

    Optional<UserLoginResponse> findById(Long id);

    UserLoginResponse save(UserRegisterRequest user);

    Optional<UserLoginResponse> update(UserRegisterRequest request, Long id);

    void remove(Long id);
}
