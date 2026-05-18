package com.sgpa.factory;

import org.springframework.stereotype.Component;

import com.sgpa.builder.ProductoDocenteBuilder;
import com.sgpa.dto.request.ProductoDocenteRequest;
import com.sgpa.model.Docente;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.TipoProducto;

@Component
public class ProductoDocenteFactory {

    public ProductoDocente crear(ProductoDocenteRequest dto, Docente docente) {
        TipoProducto tipo = TipoProducto.valueOf(dto.getTipo());
        
        return ProductoDocenteBuilder.nuevo()
            .nombre(dto.getNombre())
            .descripcion(dto.getDescripcion())
            .publicado(false)
            .tipo(tipo)
            .atributos(dto.getAtributos())
            .docente(docente)
            .build();
    }
}