package com.sgpa.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.UserRequest;
import com.sgpa.dto.request.UserRegisterRequest;
import com.sgpa.dto.response.UserRegisterResponse;
import com.sgpa.dto.response.UserResponse;
import com.sgpa.dto.response.RoleResponse;
import com.sgpa.service.RoleService;
import com.sgpa.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;
    private final RoleService roleService;

    @GetMapping("/roles")
    public List<RoleResponse> listRoles() {
        return roleService.findAll();
    }

    @GetMapping
    public List<UserResponse> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> show(@PathVariable Long id) {
        Optional<UserResponse> userOptional = service.findById(id);
        return userOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> register(
            @Valid @RequestBody UserRegisterRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return validation(result);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.register(request));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> create(
            @Valid @RequestBody UserRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return validation(result);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @Valid @RequestBody UserRequest request,
            BindingResult result,
            @PathVariable Long id) {
        if (result.hasErrors()) {
            return validation(result);
        }
        Optional<UserResponse> updated = service.update(request, id);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.remove(id);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<Map<String, String>> validation(BindingResult result) {
        Map<String, String> errors = new HashMap<>();
        result.getFieldErrors().forEach(err ->
            errors.put(err.getField(), "El campo " + err.getField() + " " + err.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(errors);
    }
}
