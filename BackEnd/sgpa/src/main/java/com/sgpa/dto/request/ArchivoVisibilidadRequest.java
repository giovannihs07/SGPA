package com.sgpa.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ArchivoVisibilidadRequest {

    @NotNull(message = "El id del archivo es obligatorio")
    private Long archivoId;

    @NotNull(message = "Debe indicar si el archivo es público")
    private Boolean accesoPublico;
}
