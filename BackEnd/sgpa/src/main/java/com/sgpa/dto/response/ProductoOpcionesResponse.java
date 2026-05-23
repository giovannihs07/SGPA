package com.sgpa.dto.response;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO para devolver las opciones disponibles para productos.
 * Agrupa categorías, subcategorías y tipos de productos.
 */
@Getter
@Setter
@Builder
@AllArgsConstructor
public class ProductoOpcionesResponse {
    
    private List<String> categorias;
    private Map<String, List<String>> subcategoriasPorCategoria;
    private Map<String, List<String>> tiposPorSubcategoria;
}
