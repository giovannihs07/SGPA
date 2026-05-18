package com.sgpa.service;

import java.util.List;
import java.util.Optional;

import com.sgpa.dto.request.UserRequest;
import com.sgpa.dto.request.UserRegisterRequest;
import com.sgpa.dto.response.UserRegisterResponse;
import com.sgpa.dto.response.UserResponse;

public interface UserService {

    UserRegisterResponse register(UserRegisterRequest request);

    List<UserResponse> findAll();

    Optional<UserResponse> findById(Long id);

    UserResponse save(UserRequest request);

    Optional<UserResponse> update(UserRequest request, Long id);

    void remove(Long id);
}
