package com.sgpa.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
@Table(name = "administrativos")
public class Administrativo {

    @Id
    private Long id;

    private String cargo;
    private String tipoContrato; // Tiempo completo, Medio tiempo, Catedrático
    private String dependencia;

    @OneToOne
    @MapsId
    @JoinColumn(name="persona_id")
    private Persona persona;       

}
