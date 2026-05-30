package com.universidad.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "universidad_personas")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UniPersona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String cedula;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(name = "email_institucional", nullable = false, unique = true, length = 150)
    private String emailInstitucional;

    @Column(length = 20)
    private String telefono;

    @Column(nullable = false)
    private Boolean habilitado = true;
}
