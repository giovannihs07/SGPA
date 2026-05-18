package com.sgpa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdministrativoResponse {

    private Long id;
    private Long personaId;
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
    private String cargo;
    private String tipoContrato;
    private String dependencia;
}
