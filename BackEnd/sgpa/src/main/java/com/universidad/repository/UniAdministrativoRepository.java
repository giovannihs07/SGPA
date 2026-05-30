package com.universidad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.universidad.model.UniAdministrativo;

@Repository
public interface UniAdministrativoRepository extends JpaRepository<UniAdministrativo, Long> {

    boolean existsByPersonaCedulaAndPersonaHabilitadoTrueAndActivoTrue(
            String cedula
    );
}
