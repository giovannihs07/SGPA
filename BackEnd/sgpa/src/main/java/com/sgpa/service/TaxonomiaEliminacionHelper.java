package com.sgpa.service;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.sgpa.exception.TaxonomiaEnUsoException;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.repository.ProductoDocenteRepository;
import com.sgpa.repository.SubcategoriaProductoRepository;
import com.sgpa.repository.TipoProductoAtributoRepository;
import com.sgpa.repository.TipoProductoRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TaxonomiaEliminacionHelper {

    private final ProductoDocenteRepository productoRepository;
    private final TipoProductoRepository tipoProductoRepository;
    private final TipoProductoAtributoRepository atributoRepository;
    private final SubcategoriaProductoRepository subcategoriaRepository;

    public void verificarTipoEliminable(Long tipoProductoId) {
        long productos = productoRepository.countByTipoProductoId(tipoProductoId);
        if (productos > 0)
            throw new TaxonomiaEnUsoException(
                "No se puede eliminar: hay " + productos
                + " producto(s) registrado(s) con este tipo.");
    }

    public void verificarSubcategoriaEliminable(Long subcategoriaId) {
        long productos = productoRepository.countBySubcategoriaId(subcategoriaId);
        if (productos > 0)
            throw new TaxonomiaEnUsoException(
                "No se puede eliminar: hay " + productos
                + " producto(s) registrado(s) en los tipos de esta subcategoría.");
    }

    public void verificarCategoriaEliminable(Long categoriaId) {
        long productos = productoRepository.countByCategoriaId(categoriaId);
        if (productos > 0)
            throw new TaxonomiaEnUsoException(
                "No se puede eliminar: hay " + productos
                + " producto(s) registrado(s) en esta categoría.");
    }

    @Transactional
    public void eliminarTipo(Long tipoProductoId) {
        verificarTipoEliminable(tipoProductoId);
        atributoRepository.deleteByTipoProductoId(tipoProductoId);
        tipoProductoRepository.deleteById(tipoProductoId);
    }

    @Transactional
    public void eliminarTiposDeSubcategoria(Long subcategoriaId) {
        for (TipoProducto tipo : tipoProductoRepository.findBySubcategoriaId(subcategoriaId)) {
            atributoRepository.deleteByTipoProductoId(tipo.getId());
            tipoProductoRepository.delete(tipo);
        }
    }

    @Transactional
    public void eliminarSubcategoria(Long subcategoriaId) {
        verificarSubcategoriaEliminable(subcategoriaId);
        eliminarTiposDeSubcategoria(subcategoriaId);
        subcategoriaRepository.deleteById(subcategoriaId);
    }

    @Transactional
    public void eliminarCategoria(Long categoriaId) {
        verificarCategoriaEliminable(categoriaId);
        for (SubcategoriaProducto sub : subcategoriaRepository.findByCategoriaId(categoriaId)) {
            eliminarTiposDeSubcategoria(sub.getId());
            subcategoriaRepository.delete(sub);
        }
    }
}
