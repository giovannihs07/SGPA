package com.sgpa.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sgpa.model.Administrativo;
import com.sgpa.model.Docente;

@Repository
public interface AdministrativoRepository extends JpaRepository<Administrativo, Long> {

    @EntityGraph(attributePaths = {
            "persona",
            "persona.user",
            "persona.user.roles"
    })
    Optional<Administrativo> findById(Long id);

    @EntityGraph(attributePaths = {
            "persona",
            "persona.user",
            "persona.user.roles"
    })
    List<Administrativo> findAll();

    List<Administrativo> findByDependencia(String dependencia);

    List<Administrativo> findByCargo(String cargo);

    @Query("SELECT a FROM Administrativo a " +
            "JOIN Persona p ON p.id = a.id " +
            "JOIN User u ON u.persona.id = p.id " +
            "WHERE u.email = :email")
    Optional<Administrativo> findByUserEmail(@Param("email") String email);
}
