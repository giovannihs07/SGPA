package com.sgpa.dto.response.reporte;

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
public class ReporteCoberturaDocenteResponse {

    private int totalDocentes;
    private int docentesConProduccion;
    private int docentesSinProduccion;
    private int porcentajeCobertura;
}
