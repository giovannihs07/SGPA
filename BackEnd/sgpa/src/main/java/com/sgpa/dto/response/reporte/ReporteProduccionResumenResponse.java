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
public class ReporteProduccionResumenResponse {

    private int total;
    private int publicados;
    private int sinPublicar;
    private int recientes;
    private int docentesActivos;
}
