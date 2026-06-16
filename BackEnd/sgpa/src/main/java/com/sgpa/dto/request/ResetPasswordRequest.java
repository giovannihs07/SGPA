package com.sgpa.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no es válido")
    @Pattern(
            regexp = "^[a-zA-Z0-9._%+-]+@unicartagena\\.edu\\.co$",
            message = "El email debe ser institucional (@unicartagena.edu.co)")
    private String email;

    @NotBlank(message = "El código es obligatorio")
    @Pattern(regexp = "^\\d{6}$", message = "El código debe tener 6 dígitos")
    private String codigo;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 8, max = 100, message = "La contraseña debe tener entre 8 y 100 caracteres")
    private String passwordNuevo;

    @NotBlank(message = "Debes confirmar la nueva contraseña")
    private String passwordConfirmacion;
}
