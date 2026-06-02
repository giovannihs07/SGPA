package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sgpa.model.products.TipoProducto;

@Repository
public interface TipoProductoRepository extends JpaRepository<TipoProducto, Long> {

    List<TipoProducto> findBySubcategoriaIdAndActivoTrue(Long subcategoriaId);

    List<TipoProducto> findBySubcategoriaId(Long subcategoriaId);

    long countBySubcategoriaId(Long subcategoriaId);

    @Query("SELECT COUNT(t) FROM TipoProducto t " +
           "WHERE t.subcategoria.categoria.id = :categoriaId")
    long countByCategoriaId(@Param("categoriaId") Long categoriaId);

    // Carga el tipo CON sus atributos en una sola query
    // evita LazyInitializationException al acceder a atributos
    @Query("SELECT t FROM TipoProducto t " +
           "LEFT JOIN FETCH t.atributos " +
           "WHERE t.id = :id")
    Optional<TipoProducto> findByIdWithAtributos(@Param("id") Long id);

    boolean existsByNombreAndSubcategoriaId(String nombre, Long subcategoriaId);
}
