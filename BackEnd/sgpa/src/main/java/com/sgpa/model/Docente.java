package com.sgpa.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "docentes")
@EqualsAndHashCode(callSuper = true)
@Getter @Setter
public class Docente extends Persona {

    private String codigoDocente;      // código institucional asignado
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> titulos = new HashMap<>();  // PhD, Magíster, Especialista, Pregrado - Flexible structure
    
    private String tipoContrato;       // Tiempo completo, Medio tiempo, Catedrático
    
    @ManyToMany
    @JoinTable(
        name = "docentes_programas", 
        joinColumns = @JoinColumn(name = "docente_id"), 
        inverseJoinColumns = @JoinColumn(name = "programa_id"),
        uniqueConstraints = @UniqueConstraint(columnNames = {"docente_id", "programa_id"})
    )
    private List<Programa> programas;

}
