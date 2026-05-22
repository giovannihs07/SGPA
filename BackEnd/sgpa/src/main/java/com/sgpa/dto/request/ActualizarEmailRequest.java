package com.sgpa.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ActualizarEmailRequest {
    @NotBlank
    @Email
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@unicartagena\\.edu\\.co$",
        message = "El email debe ser institucional"
    )
    private String emailNuevo;
    
    @NotBlank
    private String passwordActual; 
}
