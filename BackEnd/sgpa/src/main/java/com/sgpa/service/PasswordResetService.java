package com.sgpa.service;

public interface PasswordResetService {

    void solicitarReset(String email, String ipAddress);

    void restablecerPassword(String email, String codigo, String passwordNuevo,
            String passwordConfirmacion, String ipAddress);
}
