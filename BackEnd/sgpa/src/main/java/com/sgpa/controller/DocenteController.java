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

import com.sgpa.dto.request.DocenteRequest;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.service.DocenteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/docentes")
@RequiredArgsConstructor
public class DocenteController {

    private final DocenteService service;

    @PostMapping
    public ResponseEntity<DocenteResponse> crear(
            @Valid @RequestBody DocenteRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        DocenteResponse response = service.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<DocenteResponse>> buscarTodos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DocenteResponse> response = service.buscarTodosPaginado(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocenteResponse> buscarPorId(@PathVariable Long id) {
        DocenteResponse response = service.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<DocenteResponse>> buscarPorNombre(@RequestParam String nombre) {
        List<DocenteResponse> response = service.buscarPorNombre(nombre);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/apellido")
    public ResponseEntity<List<DocenteResponse>> buscarPorApellido(@RequestParam String apellido) {
        List<DocenteResponse> response = service.buscarPorApellido(apellido);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/programa/{programaId}")
    public ResponseEntity<List<DocenteResponse>> buscarPorPrograma(@PathVariable Long programaId) {
        List<DocenteResponse> response = service.buscarPorPrograma(programaId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/titulo")
    public ResponseEntity<List<DocenteResponse>> buscarPorTitulo(@RequestParam String titulo) {
        List<DocenteResponse> response = service.buscarPorTitulo(titulo);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/tipoContrato")
    public ResponseEntity<List<DocenteResponse>> buscarPorTipoContrato(@RequestParam String tipoContrato) {
        List<DocenteResponse> response = service.buscarPorTipoContrato(tipoContrato);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocenteResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody DocenteRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        DocenteResponse response = service.actualizar(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Docente eliminado correctamente");
        return ResponseEntity.ok(response);
    }
}
