package com.sgpa.dto.response.reporte;

import java.util.List;

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
public class ReporteProduccionDocentesResponse {

    private ReporteProduccionMetaResponse meta;
    private ReporteProduccionFiltrosResponse filtrosAplicados;
    private ReporteProduccionFiltrosEtiquetasResponse filtrosEtiquetas;
    private List<ReporteRankingDocenteResponse> rankingDocentes;
    private int total;
}
