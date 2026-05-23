package com.sgpa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FacultadResponse {

    private Long id;
    private String nombre;
    private String codigo;

    // Datos de la institución — evita un request extra al frontend
    private Long institucionId;
    private String institucionNombre;
}
