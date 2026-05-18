package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Facultad;

@Repository
public interface FacultadRepository extends JpaRepository<Facultad, Long> {
    
    List<Facultad> findByInstitucionId(Long institucionId);
    boolean existsByNombreAndInstitucionId(String nombre, Long institucionId);
    boolean existsByCodigo(String codigo);
    Optional<Facultad> findByCodigo(String codigo);
}
