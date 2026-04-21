package com.proyectogrado.sgpa.model;

import org.springframework.context.annotation.EnableAspectJAutoProxy;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor @NoArgsConstructor
@Getter @Setter
@Entity
public class Software implements ProductoDocente {

    private String lenguajeProgramacion;
    private String licencia;
    private String repositorio;
    private String version; 

}
