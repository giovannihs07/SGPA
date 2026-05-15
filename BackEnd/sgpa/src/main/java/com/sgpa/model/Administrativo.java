package com.sgpa.model;

import jakarta.persistence.Entity;
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
@EqualsAndHashCode(callSuper = true)
@Getter @Setter
public class Administrativo extends Persona {

    private String cargo;
    private String tipoContrato; // Tiempo completo, Medio tiempo, Catedrático
    private String dependencia;       

}
