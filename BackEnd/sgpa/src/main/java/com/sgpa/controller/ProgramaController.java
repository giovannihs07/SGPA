package com.sgpa.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.ProgramaRequest;
import com.sgpa.dto.response.ProgramaResponse;
import com.sgpa.model.NivelFormacion;
import com.sgpa.service.ProgramaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/programas")
@RequiredArgsConstructor
public class ProgramaController {

    private final ProgramaService service;

    @PostMapping
    public ResponseEntity<ProgramaResponse> crear(
            @RequestBody @Valid ProgramaRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.crear(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProgramaResponse>> listar(
            @RequestParam(required = false) Long facultadId,
            @RequestParam(required = false) Long institucionId,
            @RequestParam(required = false) String nivel) {
        if (facultadId != null)
            return ResponseEntity.ok(service.listarPorFacultad(facultadId));
        if (institucionId != null)
            return ResponseEntity.ok(
                    service.listarPorInstitucion(institucionId));
        if (nivel != null)
            return ResponseEntity.ok(service.listarPorNivel(nivel));

        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgramaResponse> buscarPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgramaResponse> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid ProgramaRequest dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/programas/niveles 
    @GetMapping("/niveles")
    public ResponseEntity<List<String>> listarNiveles() {
        return ResponseEntity.ok(
                Arrays.stream(NivelFormacion.values())
                        .map(NivelFormacion::name)
                        .toList());
    }
}
