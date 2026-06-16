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
public class ReporteProduccionGraficosResponse {

    private List<ReporteConteoItemResponse> porAnio;
    private List<ReporteConteoItemResponse> porCategoria;
    private List<ReporteConteoItemResponse> porSubcategoria;
    private List<ReporteConteoItemResponse> porTipo;
    private List<ReporteProduccionProductoLineaResponse> productosRecientes;
    private List<ReporteRankingDocenteResponse> rankingDocentesTop;
}
