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

import com.sgpa.dto.request.ProgramaRequest;
import com.sgpa.dto.response.ProgramaResponse;
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
            @Valid @RequestBody ProgramaRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        ProgramaResponse response = service.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ProgramaResponse>> buscarTodos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProgramaResponse> response = service.buscarTodosPaginado(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProgramaResponse> buscarPorId(@PathVariable Long id) {
        ProgramaResponse response = service.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<ProgramaResponse>> buscarPorNombre(@RequestParam String nombre) {
        List<ProgramaResponse> response = service.buscarPorNombre(nombre);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/facultad/{facultadId}")
    public ResponseEntity<List<ProgramaResponse>> buscarPorFacultad(@PathVariable Long facultadId) {
        List<ProgramaResponse> response = service.buscarPorFacultad(facultadId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/nivel")
    public ResponseEntity<List<ProgramaResponse>> buscarPorNivel(@RequestParam String nivel) {
        List<ProgramaResponse> response = service.buscarPorNivel(nivel);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/codigo")
    public ResponseEntity<List<ProgramaResponse>> buscarPorCodigo(@RequestParam String codigo) {
        List<ProgramaResponse> response = service.buscarPorCodigo(codigo);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProgramaResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProgramaRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        ProgramaResponse response = service.actualizar(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Programa eliminado correctamente");
        return ResponseEntity.ok(response);
    }
}
