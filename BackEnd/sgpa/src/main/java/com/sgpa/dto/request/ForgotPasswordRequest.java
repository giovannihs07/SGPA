package com.sgpa.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ForgotPasswordRequest {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no es válido")
    @Pattern(
            regexp = "^[a-zA-Z0-9._%+-]+@unicartagena\\.edu\\.co$",
            message = "El email debe ser institucional (@unicartagena.edu.co)")
    private String email;
}
