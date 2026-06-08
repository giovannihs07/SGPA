package com.sgpa.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.RegistroDocenteAdminRequest;
import com.sgpa.dto.request.RegistroDocenteRequest;
import com.sgpa.dto.request.TituloAcademicoRequest;
import com.sgpa.dto.response.DocenteAdministrativoResponse;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.service.DocenteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/docentes")
@RequiredArgsConstructor
public class DocenteController {

    private final DocenteService service;

    @PostMapping("/registro")
    public ResponseEntity<DocenteResponse> registrar(
            @RequestBody @Valid RegistroDocenteRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.registrar(dto));
    }

    @PostMapping("/registro-docente-admin")
    public ResponseEntity<DocenteAdministrativoResponse> registrarDocenteAdministrativo(
            @RequestBody @Valid RegistroDocenteAdminRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.registrarDocenteAdministrativo(
                        dto.getDocente(), dto.getAdministrativo()));
    }

    @GetMapping
    public ResponseEntity<List<DocenteResponse>> listar(
            @RequestParam(required = false) Long programaId) {
        if (programaId != null)
            return ResponseEntity.ok(service.listarPorPrograma(programaId));
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/mi")
    public ResponseEntity<DocenteResponse> buscarMiPerfil(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(service.buscarPorEmail(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocenteResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocenteResponse> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid RegistroDocenteRequest dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @PostMapping("/{id}/titulos")
    public ResponseEntity<DocenteResponse> agregarTitulo(
            @PathVariable Long id,
            @RequestBody @Valid TituloAcademicoRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.agregarTitulo(id, dto));
    }

    @DeleteMapping("/titulos/{tituloId}")
    public ResponseEntity<Void> eliminarTitulo(@PathVariable Long tituloId) {
        service.eliminarTitulo(tituloId);
        return ResponseEntity.noContent().build();
    }
}
