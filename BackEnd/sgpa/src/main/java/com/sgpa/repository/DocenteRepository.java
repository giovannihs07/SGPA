package com.sgpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Docente;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {
    
    List<Docente> findByNombreContainingIgnoreCase(String nombre);
    
    List<Docente> findByApellidoContainingIgnoreCase(String apellido);
    
    /**
     * Buscar docentes que enseñan en un programa específico
     * Utiliza la tabla intermedia docentes_programas
     */
    @Query("SELECT DISTINCT d FROM Docente d JOIN d.programas p WHERE p.id = :programaId")
    List<Docente> findByProgramasId(@Param("programaId") Long programaId);
    
    /**
     * Buscar docentes que tengan un título específico en su estructura JSON
     * Nota: La búsqueda es case-insensitive sobre los valores del JSON
     */
    @Query("SELECT d FROM Docente d WHERE CAST(d.titulos AS text) ILIKE CONCAT('%', :titulo, '%')")
    List<Docente> findByTitulo(@Param("titulo") String titulo);
    
    List<Docente> findByTipoContrato(String tipoContrato);
}
