package com.sgpa.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActualizarPerfilDocenteRequest {

    @NotBlank(message = "El tipo de contrato es obligatorio")
    private String tipoContrato;
}
