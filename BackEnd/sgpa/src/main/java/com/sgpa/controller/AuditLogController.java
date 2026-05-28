package com.sgpa.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.response.AuditLogPageResponse;
import com.sgpa.dto.response.AuditLogResumenResponse;
import com.sgpa.service.AuditService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auditoria")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<AuditLogPageResponse> listar(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) String modulo,
            @RequestParam(required = false) String accion,
            @RequestParam(required = false) String resultado,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "fechaCreacion"));

        return ResponseEntity.ok(auditService.listar(
                busqueda, modulo, accion, resultado, desde, hasta, pageable));
    }

    @GetMapping("/resumen")
    public ResponseEntity<AuditLogResumenResponse> resumen() {
        return ResponseEntity.ok(auditService.obtenerResumen());
    }

    @GetMapping("/acciones")
    public ResponseEntity<List<String>> acciones() {
        return ResponseEntity.ok(auditService.listarAcciones());
    }
}
