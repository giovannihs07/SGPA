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
public class ReporteProduccionResponse {

    private ReporteProduccionMetaResponse meta;
    private ReporteProduccionFiltrosResponse filtrosAplicados;
    private ReporteProduccionFiltrosEtiquetasResponse filtrosEtiquetas;

    private ReporteProduccionResumenResponse resumen;
    private ReporteCoberturaDocenteResponse cobertura;

    private List<ReporteProduccionFacultadResponse> porFacultad;
    private List<ReporteProduccionProgramaResponse> porPrograma;
    private List<ReporteProduccionProductoLineaResponse> productos;
    private List<ReporteRankingDocenteResponse> rankingDocentes;

    private ReporteProduccionGraficosResponse graficos;
    private ReporteProduccionOpcionesResponse opciones;
}
