package com.sgpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Docente;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {
    
    List<Docente> findByNombreContainingIgnoreCase(String nombre);
    
    List<Docente> findByApellidoContainingIgnoreCase(String apellido);
    
    List<Docente> findByProgramaId(Long programaId);
    
    List<Docente> findByTitulo(String titulo);
    
    List<Docente> findByTipoContrato(String tipoContrato);
}
