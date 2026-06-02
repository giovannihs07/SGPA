package com.sgpa.model.users;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "titulos_academicos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TituloAcademico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Enumerated(EnumType.STRING)
    private NivelAcademico nivel;

    private String institucion;

    private LocalDate fechaObtencion;

    private String pais;

    @ManyToOne
    @JoinColumn(
        name = "docente_id",
        nullable = false
    )
    private Docente docente;

}
