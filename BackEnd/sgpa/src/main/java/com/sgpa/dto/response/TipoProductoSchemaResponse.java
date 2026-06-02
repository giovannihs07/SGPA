package com.sgpa.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class TipoProductoSchemaResponse {
    private Long id;
    private String nombre;
    private List<TipoProductoAtributoResponse> atributos;
}
