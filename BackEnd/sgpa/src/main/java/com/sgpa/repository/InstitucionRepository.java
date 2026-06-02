package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.institucion.Institucion;

@Repository
public interface InstitucionRepository extends JpaRepository<Institucion, Long> {
    
    boolean existsByNit(String nit);
    boolean existsByNombre(String nombre);
    Optional<Institucion> findByNit(String nit);
    List<Institucion> findByPais(String pais);
    List<Institucion> findByCiudad(String ciudad);
}
