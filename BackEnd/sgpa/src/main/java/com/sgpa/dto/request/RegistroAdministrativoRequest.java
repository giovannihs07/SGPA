package com.sgpa.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistroAdministrativoRequest {

    @NotBlank 
    private String nombre;
    
    @NotBlank 
    private String apellido;
    
    @NotBlank 
    private String cedula;
    
    private String telefono;

    @Email
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@unicartagena\\.edu\\.co$",
        message = "El email debe ser institucional (@unicartagena.edu.co)"
    )
    @NotBlank 
    private String email;

    @NotBlank @Size(min = 8, max = 100)
    private String password;

    @NotBlank 
    private String cargo;
    
    private String dependencia;
}
