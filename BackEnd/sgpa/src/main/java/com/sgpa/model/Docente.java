package com.sgpa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    private String codigoDocente;      // código institucional asignado
    private String cedula;             // identificación

    private String titulo;             // PhD, Magíster, Especialista, Pregrado
    private String tipoContrato;       // Tiempo completo, Medio tiempo, Catedrático
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programa_id", nullable = false)
    private Programa programa;         // Ing. Sistemas, Medicina, Derecho...

}
