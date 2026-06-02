package com.sgpa.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class SubcategoriaSchemaResponse {
    private Long id;
    private String nombre;
    private List<TipoProductoSchemaResponse> tipos;
}
