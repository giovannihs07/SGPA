package com.sgpa.dto.response.reporte;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteProduccionFiltrosResponse {

    private String estado;
    private String categoria;
    private String subcategoria;
    private String tipo;
    private Long facultadId;
    private Long programaId;
    private LocalDate fechaDesde;
    private LocalDate fechaHasta;
    private String campoFecha;
    private String busqueda;
}
