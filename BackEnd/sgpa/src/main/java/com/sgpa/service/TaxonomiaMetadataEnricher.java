package com.sgpa.service;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.CategoriaResponse;
import com.sgpa.dto.response.SubcategoriaResponse;
import com.sgpa.dto.response.TipoProductoResponse;
import com.sgpa.repository.ProductoDocenteRepository;
import com.sgpa.repository.SubcategoriaProductoRepository;
import com.sgpa.repository.TipoProductoRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TaxonomiaMetadataEnricher {

    private final ProductoDocenteRepository productoRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final SubcategoriaProductoRepository subcategoriaRepository;

    public CategoriaResponse enrich(CategoriaResponse dto) {
        if (dto == null) return null;
        long productos = productoRepository.countByCategoriaId(dto.getId());
        long subcategorias = subcategoriaRepository.countByCategoriaId(dto.getId());
        long tipos = tipoProductoRepository.countByCategoriaId(dto.getId());
        dto.setProductosAsociados(productos);
        dto.setSubcategoriasAsociadas(subcategorias);
        dto.setTiposAsociados(tipos);
        dto.setEliminable(!Boolean.TRUE.equals(dto.getActivo()) && productos == 0);
        return dto;
    }

    public SubcategoriaResponse enrich(SubcategoriaResponse dto) {
        if (dto == null) return null;
        long productos = productoRepository.countBySubcategoriaId(dto.getId());
        long tipos = tipoProductoRepository.countBySubcategoriaId(dto.getId());
        dto.setProductosAsociados(productos);
        dto.setTiposAsociados(tipos);
        dto.setEliminable(!Boolean.TRUE.equals(dto.getActivo()) && productos == 0);
        return dto;
    }

    public TipoProductoResponse enrich(TipoProductoResponse dto) {
        if (dto == null) return null;
        long productos = productoRepository.countByTipoProductoId(dto.getId());
        dto.setProductosAsociados(productos);
        dto.setEliminable(!Boolean.TRUE.equals(dto.getActivo()) && productos == 0);
        return dto;
    }
}
