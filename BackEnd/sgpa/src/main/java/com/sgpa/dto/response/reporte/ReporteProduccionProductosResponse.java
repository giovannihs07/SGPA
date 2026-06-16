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
public class ReporteProduccionProductosResponse {

    private ReporteProduccionMetaResponse meta;
    private ReporteProduccionFiltrosResponse filtrosAplicados;
    private ReporteProduccionFiltrosEtiquetasResponse filtrosEtiquetas;
    private List<ReporteProduccionProductoLineaResponse> productos;
    private int total;
}
