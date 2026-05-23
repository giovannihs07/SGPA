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
public class PersonaResponse {

    private Long id;
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
    private LocalDateTime fechaCreacion;

    // Datos del User asociado — útil para saber el email y roles
    private String email;
    private String estado;
    private Set<String> roles;
}
