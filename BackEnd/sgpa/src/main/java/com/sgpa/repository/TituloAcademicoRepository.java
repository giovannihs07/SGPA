package com.sgpa.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sgpa.model.TituloAcademico;

@Repository
public interface TituloAcademicoRepository extends JpaRepository<TituloAcademico, Long> {

    List<TituloAcademico> findByDocenteId(Long docenteId);

    void deleteByDocenteId(Long docenteId);
}
