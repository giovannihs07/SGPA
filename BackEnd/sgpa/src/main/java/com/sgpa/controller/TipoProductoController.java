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

import com.sgpa.dto.request.TipoProductoRequest;
import com.sgpa.dto.response.TipoProductoAtributoResponse;
import com.sgpa.dto.response.TipoProductoResponse;
import com.sgpa.service.TipoProductoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tipos-producto")
@RequiredArgsConstructor
public class TipoProductoController {

    private final TipoProductoService service;

    @GetMapping
    public ResponseEntity<List<TipoProductoResponse>> listar(
            @RequestParam(required = false) Long subcategoriaId,
            @RequestParam(required = false, defaultValue = "true") Boolean soloActivos) {
        return ResponseEntity.ok(subcategoriaId != null
            ? service.listarPorSubcategoria(subcategoriaId, soloActivos)
            : service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoProductoResponse> buscarPorId(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // Endpoint  para obtener solo los atributos
    // Se usa al seleccionar un tipo para mostrar los campos del formulario
    @GetMapping("/{id}/atributos")
    public ResponseEntity<List<TipoProductoAtributoResponse>> listarAtributos(
            @PathVariable Long id) {
        return ResponseEntity.ok(service.listarAtributos(id));
    }

    @PostMapping
    public ResponseEntity<TipoProductoResponse> crear(
            @RequestBody @Valid TipoProductoRequest dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(service.crear(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoProductoResponse> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid TipoProductoRequest dto) {
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
