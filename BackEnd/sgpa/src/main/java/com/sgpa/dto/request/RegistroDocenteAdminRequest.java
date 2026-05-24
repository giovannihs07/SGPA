package com.sgpa.dto.request;

import jakarta.validation.Valid;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegistroDocenteAdminRequest {
    @Valid
    private RegistroDocenteRequest docente;
    
    @Valid
    private RegistroAdminParaDocenteRequest administrativo;
}
