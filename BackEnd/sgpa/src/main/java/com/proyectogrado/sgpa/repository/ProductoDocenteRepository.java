package com.proyectogrado.sgpa.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.proyectogrado.sgpa.model.CategoriaProducto;
import com.proyectogrado.sgpa.model.EstadoProducto;
import com.proyectogrado.sgpa.model.ProductoDocente;
import com.proyectogrado.sgpa.model.SubcategoriaProducto;
import com.proyectogrado.sgpa.model.TipoProducto;


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
