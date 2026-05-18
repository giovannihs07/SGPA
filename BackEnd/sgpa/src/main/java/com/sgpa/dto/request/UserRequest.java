package com.sgpa.dto.request;

import java.util.List;

import com.sgpa.model.users.RoleName;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@unicartagena\\.edu\\.co$",
        message = "El email debe ser institucional (@unicartagena.edu.co)"
    )
    private String email;

    @Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
    private String password;

    @NotNull(message = "Debe indicar la persona asociada")
    private Long personaId;

    private Boolean activo;

    @NotEmpty(message = "Debe asignar al menos un rol")
    private List<RoleName> roles;
}
