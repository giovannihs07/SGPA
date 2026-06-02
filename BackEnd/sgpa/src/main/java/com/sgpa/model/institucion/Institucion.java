package com.sgpa.model.institucion;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Institución
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "instituciones")
public class Institucion {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;      
    private String nit;
    private String ciudad;
    private String pais;
}
