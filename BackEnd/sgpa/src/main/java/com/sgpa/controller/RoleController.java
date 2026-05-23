package com.sgpa.controller;

import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

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

import com.sgpa.dto.request.RoleRequest;
import com.sgpa.dto.response.RoleResponse;
import com.sgpa.model.users.RoleName;
import com.sgpa.service.RoleService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    // Listar todos los roles
    @GetMapping
    public ResponseEntity<List<RoleResponse>> listarTodos() {
        return ResponseEntity.ok(roleService.listarTodos());
    }

    // Obtener un rol por su ID
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.buscarPorId(id));
    }

    // Crear un nuevo rol
    @PostMapping
    public ResponseEntity<RoleResponse> crear(@RequestBody @Valid RoleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roleService.crear(request));
    }

    // Actualizar un rol existente por su ID
    @PutMapping("/{id}")
    public ResponseEntity<RoleResponse> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid RoleRequest request) {
        return ResponseEntity.ok(roleService.actualizar(id, request));
    }

    // Eliminar un rol por su ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        roleService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    //Devuelve los nombres de los roles disponibles (enumerados en RoleName)
    @GetMapping("/disponibles")
    public ResponseEntity<List<String>> obtenerRolesDisponibles() {
        List<String> rolesDisponibles = Arrays.stream(RoleName.values())
            .map(RoleName::name)
            .collect(Collectors.toList());
        return ResponseEntity.ok(rolesDisponibles);
    }
}
