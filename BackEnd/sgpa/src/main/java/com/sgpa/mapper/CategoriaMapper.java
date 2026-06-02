package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.CategoriaResponse;
import com.sgpa.model.products.CategoriaProducto;

@Component
public class CategoriaMapper {

    public CategoriaResponse toDTO(CategoriaProducto categoria) {
        if (categoria == null) return null;
        return CategoriaResponse.builder()
            .id(categoria.getId())
            .nombre(categoria.getNombre())
            .activo(categoria.getActivo())
            .build();
    }

    public List<CategoriaResponse> toDTOList(List<CategoriaProducto> categorias) {
        return categorias.stream().map(this::toDTO).toList();
    }
}
