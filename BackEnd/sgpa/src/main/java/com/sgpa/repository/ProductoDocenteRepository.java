package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sgpa.model.products.ProductoDocente;
import com.sgpa.model.products.TipoProducto;
import com.sgpa.model.users.Docente;

@Repository
public interface ProductoDocenteRepository extends JpaRepository<ProductoDocente, Long>,
        JpaSpecificationExecutor<ProductoDocente> {

    @Query("SELECT DISTINCT p FROM ProductoDocente p LEFT JOIN FETCH p.archivos WHERE p.id = :id")
    Optional<ProductoDocente> findByIdWithArchivos(@Param("id") Long id);

    List<ProductoDocente> findByDocente(Docente docente);

    List<ProductoDocente> findByDocenteId(Long docenteId);

    List<ProductoDocente> findByTipoProducto(TipoProducto tipo);

    List<ProductoDocente> findByTipoProductoId(Long idTipoProducto);

    long countByTipoProductoId(Long tipoProductoId);

    @Query("SELECT COUNT(p) FROM ProductoDocente p " +
           "WHERE p.tipoProducto.subcategoria.id = :subcategoriaId")
    long countBySubcategoriaId(@Param("subcategoriaId") Long subcategoriaId);

    @Query("SELECT COUNT(p) FROM ProductoDocente p " +
           "WHERE p.tipoProducto.subcategoria.categoria.id = :categoriaId")
    long countByCategoriaId(@Param("categoriaId") Long categoriaId);

    List<ProductoDocente> findByPublicado(Boolean publicado);

    List<ProductoDocente> findByDocenteIdAndPublicado(Long docenteId, Boolean publicado);

    List<ProductoDocente> findByNombreContainingIgnoreCase(String nombre);

    Page<ProductoDocente> findByDocenteId(Long docenteId, Pageable pageable);

    Page<ProductoDocente> findByPublicado(Boolean publicado, Pageable pageable);

    @Query("""
            SELECT c.nombre, COUNT(p)
            FROM ProductoDocente p
            JOIN p.tipoProducto tp
            JOIN tp.subcategoria sc
            JOIN sc.categoria c
            WHERE p.publicado = true
            GROUP BY c.nombre
            ORDER BY COUNT(p) DESC
            """)
    List<Object[]> contarPublicadosPorCategoria();

    long countByPublicadoTrue();

    @Query("SELECT p FROM ProductoDocente p " +
            "JOIN p.docente d " +
            "JOIN d.programas prog " +
            "WHERE prog.id = :programaId")
    List<ProductoDocente> findByProgramaId(@Param("programaId") Long programaId);

    @Query("SELECT p FROM ProductoDocente p " +
            "JOIN p.docente d " +
            "JOIN d.programas prog " +
            "WHERE prog.id = :programaId AND p.tipoProducto = :tipo")
    List<ProductoDocente> findByProgramaIdAndTipo(
            @Param("programaId") Long programaId,
            @Param("tipo") TipoProducto tipo);
}
