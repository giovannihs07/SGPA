package com.sgpa.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActualizarPerfilAdministrativoRequest {

    @NotBlank(message = "El cargo es obligatorio")
    private String cargo;

    @NotBlank(message = "La dependencia es obligatoria")
    private String dependencia;
}
