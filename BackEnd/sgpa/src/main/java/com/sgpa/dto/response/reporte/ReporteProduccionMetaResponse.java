package com.sgpa.dto.response.reporte;

import java.time.OffsetDateTime;

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
public class ReporteProduccionMetaResponse {

    private OffsetDateTime generadoEn;
    private String tipo;
    private String titulo;
    private int totalProductosFiltrados;
    private int diasRecientes;
    private String notaAtribucion;
}
