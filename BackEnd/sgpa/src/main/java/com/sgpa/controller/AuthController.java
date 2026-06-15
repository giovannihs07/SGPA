package com.sgpa.controller;

import static com.sgpa.config.TokenJwtConfig.HEADER_AUTHORIZATION;
import static com.sgpa.config.TokenJwtConfig.PREFIX_TOKEN;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.LoginRequest;
import com.sgpa.dto.response.LoginResponse;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.service.AuditService;
import com.sgpa.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Inicio de sesión y tokens JWT")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final AuditService auditService;

    @PostMapping("/login")
    @SecurityRequirements
    @Operation(
            summary = "Iniciar sesión",
            description = "Autentica con email y contraseña. Devuelve un JWT en el cuerpo "
                    + "y en el encabezado Authorization (Bearer).")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            List<String> nombreRoles = auth.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(role -> role.startsWith("ROLE_"))
                    .toList();

            LoginResponse loginResponse = authService.completarLogin(auth.getName(), nombreRoles);

            auditService.registrar(ModuloAuditoria.AUTH, "LOGIN",
                    "Inicio de sesión exitoso",
                    "User", loginResponse.getUserId(), request.getEmail(), null,
                    ResultadoAuditoria.EXITOSO, request.getEmail(), httpRequest.getRemoteAddr());

            return ResponseEntity.ok()
                    .header(HEADER_AUTHORIZATION, PREFIX_TOKEN + loginResponse.getToken())
                    .body(loginResponse);
        } catch (AuthenticationException ex) {
            auditService.registrar(ModuloAuditoria.AUTH, "LOGIN_FALLIDO",
                    "Intento de inicio de sesión fallido",
                    "User", null, request.getEmail(),
                    Map.of("motivo", ex.getMessage() != null ? ex.getMessage() : "Credenciales inválidas"),
                    ResultadoAuditoria.FALLIDO, request.getEmail(), httpRequest.getRemoteAddr());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", "Error en la autenticación, email o password incorrecto!",
                    "error", ex.getMessage() != null ? ex.getMessage() : "Credenciales inválidas"));
        }
    }
}
