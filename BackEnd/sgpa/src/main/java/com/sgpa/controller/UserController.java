package com.sgpa.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.ActualizarEmailRequest;
import com.sgpa.dto.request.CambiarPasswordRequest;
import com.sgpa.dto.request.CambiarRolesRequest;
import com.sgpa.dto.response.UserDetalleResponse;
import com.sgpa.dto.response.UserResumenResponse;
import com.sgpa.model.users.EstadoUsuario;
import com.sgpa.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResumenResponse>> listarTodos() {
        return ResponseEntity.ok(userService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResumenResponse> buscarPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(userService.buscarPorId(id));
    }

    @PatchMapping("/{userId}/roles")
    public ResponseEntity<Void> cambiarRoles(
            @PathVariable Long userId,
            @RequestBody @Valid CambiarRolesRequest dto) {
        userService.cambiarRoles(userId, dto.getRoles());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{userId}/email")
    public ResponseEntity<UserResumenResponse> actualizarEmail(
            @PathVariable Long userId,
            @RequestBody @Valid ActualizarEmailRequest dto) {
        return ResponseEntity.ok(userService.actualizarEmail(userId, dto));
    }

    @PatchMapping("/cambiar-password")
    public ResponseEntity<Void> cambiarPassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid CambiarPasswordRequest dto) {

        userService.cambiarPassword(
                userDetails.getUsername(), // email viene del token JWT
                dto.getPasswordActual(),
                dto.getPasswordNuevo());
        return ResponseEntity.noContent().build();
    }

    // Ver todos los pendientes de aprobación
    @GetMapping("/pendientes")
    public ResponseEntity<List<UserDetalleResponse>> listarPendientes() {
        return ResponseEntity.ok(userService.listarPorEstado(EstadoUsuario.PENDIENTE));
    }

    // Activar registro de usuario
    @PatchMapping("/{userId}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long userId) {
        userService.activar(userId);
        return ResponseEntity.noContent().build();
    }

    // Desactivar usuario
    @PatchMapping("/{userId}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long userId) {
        userService.desactivar(userId);
        return ResponseEntity.noContent().build();
    }

    // Rechazar registro
    @PatchMapping("/{userId}/rechazar")
    public ResponseEntity<Void> rechazar(@PathVariable Long userId) {
        userService.rechazar(userId);
        return ResponseEntity.noContent().build();
    }

}
