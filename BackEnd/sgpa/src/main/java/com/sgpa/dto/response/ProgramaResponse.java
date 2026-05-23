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
public class ProgramaResponse {

    private Long id;
    private String nombre;
    private String codigo;
    private String nivel;

    // Datos de facultad e institución — evita requests extra al frontend
    private Long facultadId;
    private String facultadNombre;
    private Long institucionId;
    private String institucionNombre;
}
