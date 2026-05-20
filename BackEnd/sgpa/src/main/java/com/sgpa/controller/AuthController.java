package com.sgpa.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.sgpa.dto.request.CambiarPasswordRequest;
import com.sgpa.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // El login NO va aquí, lo maneja JwtAuthenticationFilter automáticamente
    // POST /api/auth/login → manejado por Spring Security

    @PatchMapping("/cambiar-password")
    public ResponseEntity<Void> cambiarPassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid CambiarPasswordRequest dto) {

        authService.cambiarPassword(
            userDetails.getUsername(),   // email viene del token JWT
            dto.getPasswordActual(),
            dto.getPasswordNuevo()
        );
        return ResponseEntity.noContent().build();
    }
}