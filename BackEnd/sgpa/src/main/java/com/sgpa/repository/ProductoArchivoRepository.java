package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.products.ProductoArchivo;

@Repository
public interface ProductoArchivoRepository extends JpaRepository<ProductoArchivo, Long> {

    List<ProductoArchivo> findByProductoIdOrderByOrdenAsc(Long productoId);

    Optional<ProductoArchivo> findByIdAndProductoId(Long id, Long productoId);
}
