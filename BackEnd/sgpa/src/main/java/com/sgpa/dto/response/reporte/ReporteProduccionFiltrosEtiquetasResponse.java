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
public class ReporteProduccionFiltrosEtiquetasResponse {

    private String estado;
    private String categoria;
    private String subcategoria;
    private String facultad;
    private String programa;
    private String fecha;
    private String busqueda;
}
