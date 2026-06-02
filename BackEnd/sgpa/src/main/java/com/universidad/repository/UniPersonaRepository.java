package com.universidad.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.universidad.model.UniPersona;

@Repository
public interface UniPersonaRepository extends JpaRepository<UniPersona, Long> {
    boolean existsByCedula(String cedula);
}
