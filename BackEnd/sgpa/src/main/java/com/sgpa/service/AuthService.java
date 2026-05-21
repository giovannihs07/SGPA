package com.sgpa.service;

import java.util.Set;

public interface AuthService {
    void cambiarPassword(String email, String passwordActual, String passwordNuevo);
    void cambiarRoles(Long userId, Set<String> nuevosRoles);
}
