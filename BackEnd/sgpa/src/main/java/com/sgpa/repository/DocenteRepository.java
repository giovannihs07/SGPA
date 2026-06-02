package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sgpa.model.users.Docente;

@Repository
public interface DocenteRepository extends JpaRepository<Docente, Long> {

    Optional<Docente> findByCodigoDocente(String codigoDocente);

    @Query("SELECT d FROM Docente d " +
            "JOIN d.persona p " +
            "JOIN p.user u " +
            "WHERE u.email = :email"
        )
    Optional<Docente> findByUserEmail(@Param("email") String email);

    @Query("SELECT d FROM Docente d JOIN d.programas p WHERE p.id = :programaId")
    List<Docente> findByProgramaId(@Param("programaId") Long programaId);

    @EntityGraph(attributePaths = {
            "persona",
            "programas",
            "programas.facultad",
            "programas.facultad.institucion",
            "titulos"
    })
    Optional<Docente> findById(Long id); 

    @EntityGraph(attributePaths = {
        "persona",
        "persona.user",
        "persona.user.roles",
        "programas",
        "programas.facultad",
        "programas.facultad.institucion",
        "titulos"
    })
    List<Docente> findAll();
}
