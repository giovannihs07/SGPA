package com.sgpa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class SubcategoriaResponse {
    private Long id;
    private String nombre;
    private Boolean activo;
    private Long categoriaId;
    private String categoriaNombre;
    private Long productosAsociados;
    private Long tiposAsociados;
    private Boolean eliminable;
}
