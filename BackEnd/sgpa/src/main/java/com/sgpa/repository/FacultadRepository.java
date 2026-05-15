package com.sgpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Facultad;

@Repository
public interface FacultadRepository extends JpaRepository<Facultad, Long> {
    
    List<Facultad> findByNombreContainingIgnoreCase(String nombre);
    
    List<Facultad> findByInstitucionId(Long institucionId);
}
