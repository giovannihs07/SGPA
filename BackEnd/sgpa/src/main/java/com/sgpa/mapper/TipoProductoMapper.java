package com.sgpa.mapper;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.TipoProductoAtributoResponse;
import com.sgpa.dto.response.TipoProductoResponse;
import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.model.products.TipoProductoAtributo;

@Component
public class TipoProductoMapper {

    public TipoProductoResponse toDTO(TipoProducto tipo) {
        if (tipo == null) return null;

        SubcategoriaProducto sub = tipo.getSubcategoria();
        CategoriaProducto cat = sub != null ? sub.getCategoria() : null;

        List<TipoProductoAtributoResponse> atributos =
            tipo.getAtributos() != null
                ? tipo.getAtributos().stream()
                    .sorted(Comparator.comparing(
                        a -> a.getOrden() != null ? a.getOrden() : 0))
                    .map(this::toAtributoDTO)
                    .toList()
                : List.of();

        return TipoProductoResponse.builder()
            .id(tipo.getId())
            .nombre(tipo.getNombre())
            .activo(tipo.getActivo())
            .subcategoriaId(sub != null ? sub.getId() : null)
            .subcategoriaNombre(sub != null ? sub.getNombre() : null)
            .categoriaId(cat != null ? cat.getId() : null)
            .categoriaNombre(cat != null ? cat.getNombre() : null)
            .atributos(atributos)
            .build();
    }

    public TipoProductoAtributoResponse toAtributoDTO(TipoProductoAtributo atributo) {
        return TipoProductoAtributoResponse.builder()
            .id(atributo.getId())
            .nombreAtributo(atributo.getNombreAtributo())
            .etiqueta(atributo.getEtiqueta())
            .tipoDato(atributo.getTipoDato() != null ? atributo.getTipoDato().name() : null)
            .requerido(atributo.getRequerido())
            .orden(atributo.getOrden())
            .opciones(atributo.getOpciones())
            .build();
    }

    public List<TipoProductoResponse> toDTOList(List<TipoProducto> tipos) {
        return tipos.stream().map(this::toDTO).toList();
    }
}
