package com.sgpa.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank
    @NotEmpty
    @Email
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@unicartagena\\.edu\\.co$",
        message = "El email debe ser institucional (@unicartagena.edu.co)"
    )
    private String email;

    @NotBlank
    @Size(min = 6, max = 20)
    private String password;

    private boolean docente;
    private boolean admin;
    private boolean superAdmin;
}
