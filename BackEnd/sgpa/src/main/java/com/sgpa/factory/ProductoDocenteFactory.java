package com.sgpa.factory;

import org.springframework.stereotype.Component;

import com.sgpa.builder.ProductoDocenteBuilder;
import com.sgpa.dto.request.ProductoDocenteRequestDTO;
import com.sgpa.model.Docente;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.TipoProducto;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProductoDocenteFactory {

    private final ProductoDocenteBuilder builder;

    public ProductoDocente crear(ProductoDocenteRequestDTO dto, Docente docente) {
        TipoProducto tipo = TipoProducto.valueOf(dto.getTipo());

        return builder
            .nombre(dto.getNombre())
            .descripcion(dto.getDescripcion())
            .publicado(false)
            .tipo(tipo)
            .atributos(dto.getAtributos())
            .docente(docente)
            .build();
    }

}