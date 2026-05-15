package com.sgpa.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.FacultadRequest;
import com.sgpa.dto.response.FacultadResponse;
import com.sgpa.service.FacultadService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/facultades")
@RequiredArgsConstructor
public class FacultadController {

    private final FacultadService service;

    @PostMapping
    public ResponseEntity<FacultadResponse> crear(
            @Valid @RequestBody FacultadRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        FacultadResponse response = service.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<FacultadResponse>> buscarTodos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<FacultadResponse> response = service.buscarTodosPaginado(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FacultadResponse> buscarPorId(@PathVariable Long id) {
        FacultadResponse response = service.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<FacultadResponse>> buscarPorNombre(@RequestParam String nombre) {
        List<FacultadResponse> response = service.buscarPorNombre(nombre);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/institucion/{institucionId}")
    public ResponseEntity<List<FacultadResponse>> buscarPorInstitucion(@PathVariable Long institucionId) {
        List<FacultadResponse> response = service.buscarPorInstitucion(institucionId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FacultadResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody FacultadRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        FacultadResponse response = service.actualizar(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Facultad eliminada correctamente");
        return ResponseEntity.ok(response);
    }
}
