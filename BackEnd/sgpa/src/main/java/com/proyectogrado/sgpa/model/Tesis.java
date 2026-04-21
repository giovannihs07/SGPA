package com.proyectogrado.sgpa.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Tesis implements ProductoDocente {

    private String autor;
    private String director;
    private String institucion;
    private String tipoTesis;

}
