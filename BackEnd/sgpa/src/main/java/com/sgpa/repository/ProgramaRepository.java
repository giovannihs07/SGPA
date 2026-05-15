package com.sgpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Programa;

@Repository
public interface ProgramaRepository extends JpaRepository<Programa, Long> {
    
    List<Programa> findByNombreContainingIgnoreCase(String nombre);
    
    List<Programa> findByFacultadId(Long facultadId);
    
    List<Programa> findByNivel(String nivel);
    
    List<Programa> findByCodigo(String codigo);
}
