package com.sgpa.controller;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.sgpa.dto.response.reporte.ReporteProduccionDocentesResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionProductosResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionResponse;
import com.sgpa.service.ReporteProduccionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reportes")
@RequiredArgsConstructor
public class ReporteProduccionController {

    private final ReporteProduccionService reporteProduccionService;

    /** Reporte ejecutivo: agregados, sin listados masivos de productos ni docentes. */
    @GetMapping("/produccion")
    public ResponseEntity<ReporteProduccionResponse> produccionEjecutivo(
            @RequestParam(defaultValue = "TODOS") String estado,
            @RequestParam(defaultValue = "TODAS") String categoria,
            @RequestParam(defaultValue = "TODAS") String subcategoria,
            @RequestParam(required = false) Long facultadId,
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta,
            @RequestParam(defaultValue = "fechaRegistroSgpa") String campoFecha,
            @RequestParam(required = false) String busqueda) {

        return ResponseEntity.ok(reporteProduccionService.generarEjecutivo(
                estado, categoria, subcategoria, facultadId, programaId,
                fechaDesde, fechaHasta, campoFecha, busqueda));
    }

    /** Inventario completo de productos filtrados (exportación bajo demanda). */
    @GetMapping("/produccion/productos")
    public ResponseEntity<ReporteProduccionProductosResponse> produccionProductos(
            @RequestParam(defaultValue = "TODOS") String estado,
            @RequestParam(defaultValue = "TODAS") String categoria,
            @RequestParam(defaultValue = "TODAS") String subcategoria,
            @RequestParam(required = false) Long facultadId,
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta,
            @RequestParam(defaultValue = "fechaRegistroSgpa") String campoFecha,
            @RequestParam(required = false) String busqueda) {

        return ResponseEntity.ok(reporteProduccionService.generarProductos(
                estado, categoria, subcategoria, facultadId, programaId,
                fechaDesde, fechaHasta, campoFecha, busqueda));
    }

    /** Ranking completo de docentes (exportación bajo demanda). */
    @GetMapping("/produccion/docentes")
    public ResponseEntity<ReporteProduccionDocentesResponse> produccionDocentes(
            @RequestParam(defaultValue = "TODOS") String estado,
            @RequestParam(defaultValue = "TODAS") String categoria,
            @RequestParam(defaultValue = "TODAS") String subcategoria,
            @RequestParam(required = false) Long facultadId,
            @RequestParam(required = false) Long programaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaDesde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaHasta,
            @RequestParam(defaultValue = "fechaRegistroSgpa") String campoFecha,
            @RequestParam(required = false) String busqueda) {

        return ResponseEntity.ok(reporteProduccionService.generarDocentes(
                estado, categoria, subcategoria, facultadId, programaId,
                fechaDesde, fechaHasta, campoFecha, busqueda));
    }
}
