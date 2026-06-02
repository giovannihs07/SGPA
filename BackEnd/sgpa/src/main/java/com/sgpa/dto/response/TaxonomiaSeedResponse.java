package com.sgpa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TaxonomiaSeedResponse {
    private int categorias;
    private int subcategorias;
    private int tipos;
    private String mensaje;
}
