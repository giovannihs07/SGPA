package com.sgpa.dto.response;

import java.util.List;

import com.sgpa.model.users.RoleName;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRegisterResponse {

    private Long id;
    private String email;
    private List<RoleName> roles;
    private Long personaId;
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
}
