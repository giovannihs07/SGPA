package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.SubcategoriaResponse;
import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.model.products.SubcategoriaProducto;

@Component
public class SubcategoriaMapper {

    public SubcategoriaResponse toDTO(SubcategoriaProducto sub) {
        if (sub == null) return null;
        CategoriaProducto cat = sub.getCategoria();
        return SubcategoriaResponse.builder()
            .id(sub.getId())
            .nombre(sub.getNombre())
            .activo(sub.getActivo())
            .categoriaId(cat != null ? cat.getId() : null)
            .categoriaNombre(cat != null ? cat.getNombre() : null)
            .build();
    }

    public List<SubcategoriaResponse> toDTOList(List<SubcategoriaProducto> subcategorias) {
        return subcategorias.stream().map(this::toDTO).toList();
    }
}
