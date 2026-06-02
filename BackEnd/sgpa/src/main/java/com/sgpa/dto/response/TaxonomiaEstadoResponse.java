package com.sgpa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TaxonomiaEstadoResponse {
    private Boolean existe;
    private Long categorias;
    private Long subcategorias;
    private Long tipos;
}
