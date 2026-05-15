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

import com.sgpa.dto.request.AdministrativoRequest;
import com.sgpa.dto.response.AdministrativoResponse;
import com.sgpa.service.AdministrativoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/administrativos")
@RequiredArgsConstructor
public class AdministrativoController {

    private final AdministrativoService service;

    @PostMapping
    public ResponseEntity<AdministrativoResponse> crear(
            @Valid @RequestBody AdministrativoRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        AdministrativoResponse response = service.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<AdministrativoResponse>> buscarTodos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AdministrativoResponse> response = service.buscarTodosPaginado(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdministrativoResponse> buscarPorId(@PathVariable Long id) {
        AdministrativoResponse response = service.buscarPorId(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/nombre")
    public ResponseEntity<List<AdministrativoResponse>> buscarPorNombre(@RequestParam String nombre) {
        List<AdministrativoResponse> response = service.buscarPorNombre(nombre);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/apellido")
    public ResponseEntity<List<AdministrativoResponse>> buscarPorApellido(@RequestParam String apellido) {
        List<AdministrativoResponse> response = service.buscarPorApellido(apellido);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/cargo")
    public ResponseEntity<List<AdministrativoResponse>> buscarPorCargo(@RequestParam String cargo) {
        List<AdministrativoResponse> response = service.buscarPorCargo(cargo);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar/dependencia")
    public ResponseEntity<List<AdministrativoResponse>> buscarPorDependencia(@RequestParam String dependencia) {
        List<AdministrativoResponse> response = service.buscarPorDependencia(dependencia);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdministrativoResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody AdministrativoRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        AdministrativoResponse response = service.actualizar(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        Map<String, String> response = new HashMap<>();
        response.put("mensaje", "Administrativo eliminado correctamente");
        return ResponseEntity.ok(response);
    }
}
