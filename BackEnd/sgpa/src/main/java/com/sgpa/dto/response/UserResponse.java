package com.sgpa.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private List<String> roles;
    
    // Información de Persona asociada
    private Long personaId;
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
}