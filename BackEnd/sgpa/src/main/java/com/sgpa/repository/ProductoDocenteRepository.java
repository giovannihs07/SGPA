package com.sgpa.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.products.CategoriaProducto;
import com.sgpa.model.products.EstadoProducto;
import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.SubcategoriaProducto;
import com.sgpa.model.products.TipoProducto;


@Repository
public interface ProductoDocenteRepository extends JpaRepository<ProductoDocente, Long> {

    List<ProductoDocente> findByCategoria(CategoriaProducto categoria);
    List<ProductoDocente> findBySubcategoria(SubcategoriaProducto subcategoria);
    List<ProductoDocente> findByTipo(TipoProducto tipo);
    List<ProductoDocente> findByEstado(EstadoProducto estado);
    List<ProductoDocente> findByCategoriaAndSubcategoria(
        CategoriaProducto categoria,
        SubcategoriaProducto subcategoria
    );
    List<ProductoDocente> findByNombreContainingIgnoreCase(String nombre);
    Page<ProductoDocente> findAll(Pageable pageable);
    Page<ProductoDocente> findByCategoria(CategoriaProducto categoria, Pageable pageable);
}
