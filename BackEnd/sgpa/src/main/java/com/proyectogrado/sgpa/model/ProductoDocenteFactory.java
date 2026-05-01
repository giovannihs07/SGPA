package com.proyectogrado.sgpa.model;

import org.springframework.stereotype.Component;

import com.proyectogrado.sgpa.dto.ProductoDocenteRequestDTO;

@Component
public class ProductoDocenteFactory {

    private final ProductoDocenteBuilder builder;

    public ProductoDocenteFactory(ProductoDocenteBuilder builder) {
        this.builder = builder;
    }

    public ProductoDocente crear(ProductoDocenteRequestDTO dto) {
    TipoProducto tipo = TipoProducto.valueOf(dto.getTipo());

    return builder
        .nombre(dto.getNombre())
        .estado("SIN_PUBLICAR")          // corregido
        .descripcion(dto.getDescripcion())
        .url(dto.getUrl())
        .tipo(tipo)
        .atributos(dto.getAtributos())
        .build();
    }

}