package com.sgpa.service;

import java.time.LocalDate;

import com.sgpa.dto.response.reporte.ReporteProduccionDocentesResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionProductosResponse;
import com.sgpa.dto.response.reporte.ReporteProduccionResponse;

public interface ReporteProduccionService {

    ReporteProduccionResponse generarEjecutivo(
            String estado,
            String categoria,
            String subcategoria,
            String tipo,
            Long facultadId,
            Long programaId,
            LocalDate fechaDesde,
            LocalDate fechaHasta,
            String campoFecha,
            String busqueda);

    ReporteProduccionProductosResponse generarProductos(
            String estado,
            String categoria,
            String subcategoria,
            String tipo,
            Long facultadId,
            Long programaId,
            LocalDate fechaDesde,
            LocalDate fechaHasta,
            String campoFecha,
            String busqueda);

    ReporteProduccionDocentesResponse generarDocentes(
            String estado,
            String categoria,
            String subcategoria,
            String tipo,
            Long facultadId,
            Long programaId,
            LocalDate fechaDesde,
            LocalDate fechaHasta,
            String campoFecha,
            String busqueda);
}
