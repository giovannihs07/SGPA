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
public class DocenteResponse {

    private Long id;
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
    private String codigoDocente;
    private String titulo;
    private String tipoContrato;
    private Long programaId;
    private String programaNombre;
}
