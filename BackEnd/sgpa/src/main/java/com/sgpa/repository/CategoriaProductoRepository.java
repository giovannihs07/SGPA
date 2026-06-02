package com.sgpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.products.CategoriaProducto;

@Repository
public interface CategoriaProductoRepository extends JpaRepository<CategoriaProducto, Long> {
    boolean existsByNombre(String nombre);
    List<CategoriaProducto> findByActivoTrue();
}
