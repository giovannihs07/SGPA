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

    Optional<Docente> findByPersonaId(Long personaId);

    @Query("SELECT d FROM Docente d WHERE LOWER(d.persona.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))")
    List<Docente> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);

    @Query("SELECT d FROM Docente d WHERE LOWER(d.persona.apellido) LIKE LOWER(CONCAT('%', :apellido, '%'))")
    List<Docente> findByApellidoContainingIgnoreCase(@Param("apellido") String apellido);

    @Query("SELECT DISTINCT d FROM Docente d JOIN d.programas p WHERE p.id = :programaId")
    List<Docente> findByProgramasId(@Param("programaId") Long programaId);

    @Query("SELECT DISTINCT d FROM Docente d JOIN d.titulos t WHERE LOWER(t.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))")
    List<Docente> findByTitulo(@Param("titulo") String titulo);

    List<Docente> findByTipoContrato(String tipoContrato);

    // Navega: User.email → User.persona → Docente
    // Funciona porque Docente comparte id con Persona via @MapsId
    @Query("SELECT d FROM Docente d " +
           "JOIN Persona p ON p.id = d.id " +
           "JOIN User u ON u.persona.id = p.id " +
           "WHERE u.email = :email")
    Optional<Docente> findByUserEmail(@Param("email") String email);
}
