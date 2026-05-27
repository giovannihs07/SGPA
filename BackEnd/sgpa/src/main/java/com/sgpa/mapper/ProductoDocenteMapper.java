package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.model.Docente;
import com.sgpa.model.Persona;
import com.sgpa.model.products.ProductoDocente;

@Component
public class ProductoDocenteMapper {

    public ProductoDocenteResponse toDTO(ProductoDocente producto) {
        if (producto == null) {
            return null;
        }

        Docente docente = producto.getDocente();
        Long docenteId = docente != null ? docente.getId() : null;
        String docenteNombre = null;
        String docenteApellido = null;
        String docenteCodigo = null;

        if (docente != null) {
            docenteCodigo = docente.getCodigoDocente();
            Persona persona = docente.getPersona();
            if (persona != null) {
                docenteNombre = persona.getNombre();
                docenteApellido = persona.getApellido();
            }
        }

        return ProductoDocenteResponse.builder()
            .id(producto.getId())
            .nombre(producto.getNombre())
            .publicado(producto.getPublicado())
            .descripcion(producto.getDescripcion())
            .nombreArchivo(producto.getNombreArchivo())
            .nombreArchivoOriginal(producto.getNombreArchivoOriginal())
            .extensionArchivo(extraerExtension(producto.getNombreArchivoOriginal()))
            .categoria(producto.getTipo() != null ? producto.getTipo().getCategoria().name() : null)
            .subcategoria(producto.getTipo() != null ? producto.getTipo().getSubcategoria().name() : null)
            .tipo(producto.getTipo() != null ? producto.getTipo().name() : null)
            .fechaCreacion(producto.getFechaCreacion())
            .fechaPublicacion(producto.getFechaPublicacion())
            .atributos(producto.getAtributos())
            .docenteId(docenteId)
            .docenteNombre(docenteNombre)
            .docenteApellido(docenteApellido)
            .docenteCodigo(docenteCodigo)
            .build();
    }

    public List<ProductoDocenteResponse> toDTOList(List<ProductoDocente> productos) {
        return productos.stream().map(this::toDTO).toList();
    }

    private String extraerExtension(String nombreOriginal) {
        if (nombreOriginal == null || !nombreOriginal.contains(".")) {
            return null;
        }
        return nombreOriginal.substring(nombreOriginal.lastIndexOf('.') + 1).toUpperCase();
    }
}
