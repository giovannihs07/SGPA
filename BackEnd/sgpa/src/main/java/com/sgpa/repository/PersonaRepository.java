package com.sgpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Persona;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Long> {

}
