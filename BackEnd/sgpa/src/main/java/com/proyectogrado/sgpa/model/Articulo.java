package com.proyectogrado.sgpa.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@AllArgsConstructor
@Getter @Setter
@NoArgsConstructor
public class Articulo implements ProductoDocente {

    private String doi;
    private String isbn;
    private String numero;
    private String paginacion;
    private String revista;
    private String volumen;
    private String tipoArticulo;
    
}
