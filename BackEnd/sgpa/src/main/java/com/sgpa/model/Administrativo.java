package com.sgpa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "administrativos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Administrativo {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name="persona_id")
    private Persona persona;       

    private String cargo; 
    private String dependencia;
}
