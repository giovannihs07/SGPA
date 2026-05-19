package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Docente;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {

    Optional<Docente> findByCodigoDocente(String codigoDocente);

    @Query("SELECT d FROM Docente d " +
           "JOIN Persona p ON p.id = d.id " +
           "JOIN User u ON u.persona.id = p.id " +
           "WHERE u.email = :email")
    Optional<Docente> findByUserEmail(@Param("email") String email);

    @Query("SELECT d FROM Docente d JOIN d.programas p WHERE p.id = :programaId")
    List<Docente> findByProgramaId(@Param("programaId") Long programaId);
}
