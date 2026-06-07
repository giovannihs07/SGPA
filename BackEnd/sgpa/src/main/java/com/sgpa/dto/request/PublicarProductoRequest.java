package com.sgpa.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PublicarProductoRequest {

    @Valid
    private List<ArchivoVisibilidadRequest> archivosVisibilidad;
}
