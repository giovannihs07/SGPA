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
public class ReporteRankingDocenteResponse {

    private Long docenteId;
    private String nombre;
    private String codigo;
    private String facultades;
    private String programas;
    private int total;
    private int publicados;
    private int sinPublicar;
    private int recientes;
}
