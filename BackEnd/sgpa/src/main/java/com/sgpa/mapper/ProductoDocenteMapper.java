package com.sgpa.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.ProductoArchivoResponse;
import com.sgpa.dto.response.ProductoDocenteResponse;
import com.sgpa.model.institucion.Programa;
import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.model.users.Docente;
import com.sgpa.model.users.Persona;

@Component
public class ProductoDocenteMapper {

    private final ProductoArchivoMapper archivoMapper;

    public ProductoDocenteMapper(ProductoArchivoMapper archivoMapper) {
        this.archivoMapper = archivoMapper;
    }

    public ProductoDocenteResponse toDTO(ProductoDocente producto) {
        if (producto == null) return null;

        Docente docente = producto.getDocente();
        TipoProducto tipo = producto.getTipoProducto();
        SubcategoriaProducto subcategoria = tipo != null
            ? tipo.getSubcategoria() : null;
        CategoriaProducto categoria = subcategoria != null
            ? subcategoria.getCategoria() : null;

        String docenteNombre = null;
        String docenteApellido = null;
        String docenteCodigo = null;
        Set<String> programas = null;

        if (docente != null) {
            docenteCodigo = docente.getCodigoDocente();
            Persona persona = docente.getPersona();
            if (persona != null) {
                docenteNombre = persona.getNombre();
                docenteApellido = persona.getApellido();
            }
            if (docente.getProgramas() != null) {
                programas = docente.getProgramas().stream()
                    .map(Programa::getNombre)
                    .collect(Collectors.toSet());
            }
        }

        ProductoDocenteResponse dto = new ProductoDocenteResponse();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setTipoProductoId(tipo != null ? tipo.getId() : null);
        dto.setSubcategoriaId(subcategoria != null ? subcategoria.getId() : null);
        dto.setCategoriaId(categoria != null ? categoria.getId() : null);
        dto.setTipo(tipo != null ? tipo.getNombre() : null);
        dto.setSubcategoria(subcategoria != null ? subcategoria.getNombre() : null);
        dto.setCategoria(categoria != null ? categoria.getNombre() : null);
        dto.setPublicado(producto.getPublicado());
        dto.setFechaCreacion(producto.getFechaCreacion());
        dto.setFechaPublicacion(producto.getFechaPublicacion());
        List<ProductoArchivoResponse> archivosDto = archivoMapper.toDTOList(producto.getArchivos());
        dto.setArchivos(archivosDto);
        dto.setNombreArchivo(producto.getNombreArchivo());
        dto.setNombreArchivoOriginal(producto.getNombreArchivoOriginal());
        dto.setExtensionArchivo(extraerExtension(producto.getNombreArchivoOriginal()));
        dto.setAtributos(producto.getAtributos());
        dto.setDocenteId(docente != null ? docente.getId() : null);
        dto.setDocenteNombre(docenteNombre);
        dto.setDocenteApellido(docenteApellido);
        dto.setDocenteCodigo(docenteCodigo);
        dto.setProgramas(programas);
        return dto;
    }

    public List<ProductoDocenteResponse> toDTOList(
            List<ProductoDocente> productos) {
        return productos.stream().map(this::toDTO).toList();
    }

    private String extraerExtension(String nombreOriginal) {
        if (nombreOriginal == null || !nombreOriginal.contains("."))
            return null;
        return nombreOriginal
            .substring(nombreOriginal.lastIndexOf('.') + 1)
            .toUpperCase();
    }
}
