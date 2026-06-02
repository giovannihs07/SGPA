package com.sgpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.products.SubcategoriaProducto;

@Repository
public interface SubcategoriaProductoRepository extends JpaRepository<SubcategoriaProducto, Long> {
    List<SubcategoriaProducto> findByCategoriaIdAndActivoTrue(Long categoriaId);
    List<SubcategoriaProducto> findByCategoriaId(Long categoriaId);
    long countByCategoriaId(Long categoriaId);
    boolean existsByNombreAndCategoriaId(String nombre, Long categoriaId);
}
