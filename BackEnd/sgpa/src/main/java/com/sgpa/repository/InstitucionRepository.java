package com.sgpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Institucion;

@Repository
public interface InstitucionRepository extends JpaRepository<Institucion, Long> {
    
    List<Institucion> findByNombreContainingIgnoreCase(String nombre);
    
    List<Institucion> findByNit(String nit);
    
    List<Institucion> findByCiudad(String ciudad);
    
    List<Institucion> findByPais(String pais);
}
