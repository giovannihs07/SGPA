package com.sgpa.service;

import java.util.List;

import com.sgpa.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse completarLogin(String email, List<String> roles);
}
