package com.sgpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Administrativo;

@Repository
public interface AdministrativoRepository extends JpaRepository<Administrativo, Long> {
    
    List<Administrativo> findByNombreContainingIgnoreCase(String nombre);
    
    List<Administrativo> findByApellidoContainingIgnoreCase(String apellido);
    
    List<Administrativo> findByCargoContainingIgnoreCase(String cargo);
    
    List<Administrativo> findByDependencia(String dependencia);
}
