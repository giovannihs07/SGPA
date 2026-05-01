package com.proyectogrado.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.proyectogrado.sgpa.dto.ProductoDocenteResponseDTO;
import com.proyectogrado.sgpa.model.ProductoDocente;

// mapper/ProductoDocenteMapper.java
@Component
public class ProductoDocenteMapper {

    public ProductoDocenteResponseDTO toDTO(ProductoDocente producto) {
        return ProductoDocenteResponseDTO.builder()
            .id(producto.getId())
            .nombre(producto.getNombre())
            .estado(producto.getEstado())
            .descripcion(producto.getDescripcion())
            .url(producto.getUrl())
            .categoria(producto.getCategoria().name())
            .subcategoria(producto.getSubcategoria().name())
            .tipo(producto.getTipo().name())
            .fechaCreacion(producto.getFechaCreacion())
            .atributos(producto.getAtributos())
            .build();
    }

    public List<ProductoDocenteResponseDTO> toDTOList(List<ProductoDocente> productos) {
        return productos.stream()
            .map(this::toDTO)
            .toList();
    }
}
