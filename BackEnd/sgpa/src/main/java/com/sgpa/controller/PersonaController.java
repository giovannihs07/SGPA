package com.sgpa.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.request.PersonaRequest;
import com.sgpa.dto.response.PersonaResponse;
import com.sgpa.service.PersonaService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/personas")
@RequiredArgsConstructor
public class PersonaController {

    private final PersonaService service;

    @GetMapping
    public List<PersonaResponse> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonaResponse> show(@PathVariable Long id) {
        Optional<PersonaResponse> persona = service.findById(id);
        return persona.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PersonaResponse create(@Valid @RequestBody PersonaRequest request) {
        return service.save(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonaResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody PersonaRequest request) {
        return service.update(id, request)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (service.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.remove(id);
        return ResponseEntity.noContent().build();
    }
}
