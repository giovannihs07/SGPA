package com.sgpa.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.ActualizarEmailRequest;
import com.sgpa.dto.request.ActualizarPerfilAdministrativoRequest;
import com.sgpa.dto.request.ActualizarPerfilDocenteRequest;
import com.sgpa.dto.request.ActualizarPerfilProgramasRequest;
import com.sgpa.dto.request.ActualizarPerfilRequest;
import com.sgpa.dto.request.CambiarPasswordRequest;
import com.sgpa.dto.request.CambiarRolesRequest;
import com.sgpa.dto.request.TituloAcademicoRequest;
import com.sgpa.dto.response.UserDetalleResponse;
import com.sgpa.dto.response.UserResumenResponse;
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

    @GetMapping("/perfil")
    public ResponseEntity<UserDetalleResponse> obtenerPerfil(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.obtenerPerfil(userDetails.getUsername()));
    }

    @PatchMapping("/perfil")
    public ResponseEntity<UserDetalleResponse> actualizarPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ActualizarPerfilRequest dto) {
        return ResponseEntity.ok(
                userService.actualizarPerfil(userDetails.getUsername(), dto));
    }

    @PatchMapping("/perfil/docente")
    public ResponseEntity<UserDetalleResponse> actualizarPerfilDocente(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ActualizarPerfilDocenteRequest dto) {
        return ResponseEntity.ok(
                userService.actualizarPerfilDocente(userDetails.getUsername(), dto));
    }

    @PatchMapping("/perfil/docente/programas")
    public ResponseEntity<UserDetalleResponse> actualizarProgramasPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ActualizarPerfilProgramasRequest dto) {
        return ResponseEntity.ok(
                userService.actualizarProgramasPerfil(userDetails.getUsername(), dto));
    }

    @PatchMapping("/perfil/administrativo")
    public ResponseEntity<UserDetalleResponse> actualizarPerfilAdministrativo(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid ActualizarPerfilAdministrativoRequest dto) {
        return ResponseEntity.ok(
                userService.actualizarPerfilAdministrativo(userDetails.getUsername(), dto));
    }

    @PostMapping("/perfil/titulos")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserDetalleResponse> agregarTituloPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody @Valid TituloAcademicoRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.agregarTituloPerfil(userDetails.getUsername(), dto));
    }

    @DeleteMapping("/perfil/titulos/{tituloId}")
    public ResponseEntity<UserDetalleResponse> eliminarTituloPerfil(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tituloId) {
        return ResponseEntity.ok(
                userService.eliminarTituloPerfil(userDetails.getUsername(), tituloId));
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
                userDetails.getUsername(),
                dto.getPasswordActual(),
                dto.getPasswordNuevo());
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{userId}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long userId) {
        userService.activar(userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{userId}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long userId) {
        userService.desactivar(userId);
        return ResponseEntity.noContent().build();
    }
}
