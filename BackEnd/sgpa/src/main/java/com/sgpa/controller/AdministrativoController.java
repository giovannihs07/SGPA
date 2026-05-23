package com.sgpa.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.RegistroAdministrativoRequest;
import com.sgpa.dto.response.AdministrativoResponse;
import com.sgpa.service.AdministrativoService;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/administrativos")
@RequiredArgsConstructor
public class AdministrativoController {

    private final AdministrativoService service;

    // Registrar un nuevo administrativo
    @PostMapping("/registro")
    public ResponseEntity<AdministrativoResponse> registrar(
            @RequestBody @Valid RegistroAdministrativoRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(service.registrar(dto));
    }

    // Listar todos los administrativos
    @GetMapping
    public ResponseEntity<List<AdministrativoResponse>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // Listar administrativos por dependencia
    @GetMapping("/dependencia/{dependencia}")
    public ResponseEntity<List<AdministrativoResponse>> listarPorDependencia(
            @PathVariable String dependencia) {
        return ResponseEntity.ok(service.listarPorDependencia(dependencia));
    }

    // Obtener un administrativo por su ID
    @GetMapping("/{id}")
    public ResponseEntity<AdministrativoResponse> buscarPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // Actualizar un administrativo existente por su ID
    @PutMapping("/{id}")
    public ResponseEntity<AdministrativoResponse> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid RegistroAdministrativoRequest dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

}