package com.sgpa.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

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

    // Datos de persona
    private Long id;
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
    private LocalDateTime fechaCreacion;

    // Datos del User
    private String email;
    private Boolean activo;
    private Set<String> roles;

    // Datos propios del Administrativo
    private String cargo;
    private String tipoContrato;
    private String dependencia;
}
