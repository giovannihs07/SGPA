package com.sgpa.factory;

import org.springframework.stereotype.Component;

import com.sgpa.builder.ProductoDocenteBuilder;
import com.sgpa.dto.request.ProductoDocenteRequestDTO;
import com.sgpa.model.products.EstadoProducto;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.TipoProducto;

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
        .descripcion(dto.getDescripcion())
        .estado(EstadoProducto.SIN_PUBLICAR) // por defecto, el producto inicia sin publicar
        .tipo(tipo)
        .atributos(dto.getAtributos())
        .build();
    }

}