package com.sgpa.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.SubcategoriaRequest;
import com.sgpa.dto.response.SubcategoriaResponse;
import com.sgpa.service.SubcategoriaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/subcategorias")
@RequiredArgsConstructor
public class SubcategoriaController {

    private final SubcategoriaService service;

    @GetMapping
    public ResponseEntity<List<SubcategoriaResponse>> listar(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false, defaultValue = "true") Boolean soloActivas) {
        return ResponseEntity.ok(categoriaId != null
            ? service.listarPorCategoria(categoriaId, soloActivas)
            : service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubcategoriaResponse> buscarPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<SubcategoriaResponse> crear(
            @RequestBody @Valid SubcategoriaRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(service.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubcategoriaResponse> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid SubcategoriaRequest dto) {
        return ResponseEntity.ok(service.actualizar(id, dto));
    }

    @PatchMapping("/{id}/activar")
    public ResponseEntity<Void> activar(@PathVariable Long id) {
        service.activar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        service.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
