package com.universidad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.universidad.model.UniDocente;

@Repository
public interface UniDocenteRepository extends JpaRepository<UniDocente, Long> {

    boolean existsByPersonaCedulaAndPersonaHabilitadoTrueAndActivoTrue(
            String cedula
    );
}
