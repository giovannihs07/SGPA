package com.sgpa.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Facultad
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "facultades")
public class Facultad {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;      // Facultad de Ingeniería

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "institucion_id")
    @JsonIgnore
    private Institucion institucion;
}