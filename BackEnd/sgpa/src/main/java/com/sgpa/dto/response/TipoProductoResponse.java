package com.sgpa.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TipoProductoResponse {
    private Long id;
    private String nombre;
    private Boolean activo;
    private Long subcategoriaId;
    private String subcategoriaNombre;
    private Long categoriaId;
    private String categoriaNombre;
    private List<TipoProductoAtributoResponse> atributos;
    private Long productosAsociados;
    private Boolean eliminable;
}
