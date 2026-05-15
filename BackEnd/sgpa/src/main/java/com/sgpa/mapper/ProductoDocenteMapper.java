package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.ProductoDocenteResponseDTO;
import com.sgpa.model.products.ProductoDocente;

// mapper/ProductoDocenteMapper.java
@Component
public class ProductoDocenteMapper {

    public ProductoDocenteResponseDTO toDTO(ProductoDocente producto) {
        Long docenteId = producto.getDocente() != null ? producto.getDocente().getId() : null;
        String docenteNombre = producto.getDocente() != null ? producto.getDocente().getNombre() : null;
        String docenteApellido = producto.getDocente() != null ? producto.getDocente().getApellido() : null;
        String docenteCodigoDocente = producto.getDocente() != null ? producto.getDocente().getCodigoDocente() : null;
        
        return ProductoDocenteResponseDTO.builder()
            .id(producto.getId())
            .nombre(producto.getNombre())
            .estado(producto.getEstado())
            .descripcion(producto.getDescripcion())
            .nombreArchivo(producto.getNombreArchivo())
            .nombreArchivoOriginal(producto.getNombreArchivoOriginal())
            .categoria(producto.getCategoria().name())
            .subcategoria(producto.getSubcategoria().name())
            .tipo(producto.getTipo().name())
            .fechaCreacion(producto.getFechaCreacion())
            .fechaPublicacion(producto.getFechaPublicacion())
            .atributos(producto.getAtributos())
            .docenteId(docenteId)
            .docenteNombre(docenteNombre)
            .docenteApellido(docenteApellido)
            .docenteCodigoDocente(docenteCodigoDocente)
            .build();
    }

    public List<ProductoDocenteResponseDTO> toDTOList(List<ProductoDocente> productos) {
        return productos.stream()
            .map(this::toDTO)
            .toList();
    }
}
