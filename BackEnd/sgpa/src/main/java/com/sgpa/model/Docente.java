package com.sgpa.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "docentes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Docente{

    @Id
    private Long id;

    private String codigoDocente;      // código institucional asignado
    
    @OneToMany(
        mappedBy = "docente",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<TituloAcademico> titulos;  // PhD, Magíster, Especialista, Pregrado
    
    private String tipoContrato;       // Tiempo completo, Medio tiempo, Catedrático
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "persona_id")
    private Persona persona;
    
    @ManyToMany
    @JoinTable(
        name = "docentes_programas", 
        joinColumns = @JoinColumn(name = "docente_id"), 
        inverseJoinColumns = @JoinColumn(name = "programa_id"),
        uniqueConstraints = @UniqueConstraint(columnNames = {"docente_id", "programa_id"})
    )
    
    private Set<Programa> programas = new HashSet<>();

}
