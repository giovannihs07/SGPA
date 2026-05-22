package com.sgpa.dto.response;

import java.util.Set;

import com.sgpa.model.users.RoleName;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResumenResponse {

    private Long id;
    private String email;
    private Boolean activo;
    private Set<String> roles;
    private Long personaId;
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
}
