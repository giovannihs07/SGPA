package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.institucion.NivelFormacion;
import com.sgpa.model.institucion.Programa;

@Repository
public interface ProgramaRepository extends JpaRepository<Programa, Long> {
    List<Programa> findByFacultadId(Long facultadId);
    List<Programa> findByNivel(NivelFormacion nivel);
    List<Programa> findByFacultadInstitucionId(Long institucionId);
    boolean existsByCodigo(String codigo);
    boolean existsByNombreAndFacultadId(String nombre, Long facultadId);
    Optional<Programa> findByCodigo(String codigo);
    boolean existsByNombreIgnoreCaseAndFacultadId(String nombre, Long facultadId);
    boolean existsByNombreIgnoreCaseAndFacultadIdAndIdNot(String nombre, Long facultadId, Long id);
    boolean existsByCodigoIgnoreCase(String codigo);
    boolean existsByCodigoIgnoreCaseAndIdNot(String codigo, Long id);
    long countByFacultadId(Long facultadId);
}
