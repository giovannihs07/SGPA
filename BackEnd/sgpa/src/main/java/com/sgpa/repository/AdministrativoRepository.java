package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Administrativo;

@Repository
public interface AdministrativoRepository extends JpaRepository<Administrativo, Long> {

    Optional<Administrativo> findByPersonaId(Long personaId);

    @Query("SELECT a FROM Administrativo a WHERE LOWER(a.persona.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Administrativo> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);

    @Query("SELECT a FROM Administrativo a WHERE LOWER(a.persona.apellido) LIKE LOWER(CONCAT('%', :apellido, '%'))")
    List<Administrativo> findByApellidoContainingIgnoreCase(@Param("apellido") String apellido);

    List<Administrativo> findByCargoContainingIgnoreCase(String cargo);

    List<Administrativo> findByDependencia(String dependencia);
}
