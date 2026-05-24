package com.sgpa.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.InstitucionRequest;
import com.sgpa.dto.response.InstitucionResponse;
import com.sgpa.service.InstitucionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/instituciones")
@RequiredArgsConstructor
public class InstitucionController {

    private final InstitucionService service;

    // POST /api/instituciones
    @PostMapping
    public ResponseEntity<InstitucionResponse> crear(
        @RequestBody @Valid InstitucionRequest dto
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(service.crear(dto));
    }

    // GET /api/instituciones
    @GetMapping
    public ResponseEntity<List<InstitucionResponse>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    // GET /api/instituciones/{id}
    @GetMapping("/{id}")
    public ResponseEntity<InstitucionResponse> buscarPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // PUT /api/instituciones/{id}
    @PutMapping("/{id}")
    public ResponseEntity<InstitucionResponse> actualizar(
        @PathVariable Long id,
        @RequestBody @Valid InstitucionRequest dto
    ) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    // DELETE /api/instituciones/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
