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

    @PostMapping
    public ResponseEntity<InstitucionResponse> crear(
            @Valid @RequestBody InstitucionRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        InstitucionResponse response = service.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<InstitucionResponse>> buscarTodos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<InstitucionResponse> response = service.buscarTodosPaginado(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InstitucionResponse> buscarPorId(@PathVariable Long id) {
        InstitucionResponse response = service.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<InstitucionResponse>> buscarPorNombre(@RequestParam String nombre) {
        List<InstitucionResponse> response = service.buscarPorNombre(nombre);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/nit")
    public ResponseEntity<List<InstitucionResponse>> buscarPorNit(@RequestParam String nit) {
        List<InstitucionResponse> response = service.buscarPorNit(nit);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/ciudad")
    public ResponseEntity<List<InstitucionResponse>> buscarPorCiudad(@RequestParam String ciudad) {
        List<InstitucionResponse> response = service.buscarPorCiudad(ciudad);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/pais")
    public ResponseEntity<List<InstitucionResponse>> buscarPorPais(@RequestParam String pais) {
        List<InstitucionResponse> response = service.buscarPorPais(pais);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InstitucionResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody InstitucionRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        InstitucionResponse response = service.actualizar(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Institución eliminada correctamente");
        return ResponseEntity.ok(response);
    }
}
