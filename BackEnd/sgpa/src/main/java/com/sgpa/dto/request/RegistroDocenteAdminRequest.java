package com.sgpa.dto.request;

import java.util.List;
import java.util.Set;

import com.sgpa.dto.response.ProgramaResponse;
import com.sgpa.dto.response.TituloAcademicoResponse;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegistroDocenteAdminRequest {
    @Valid
    private RegistroDocenteRequest docente;
    
    @Valid
    private RegistroAdminParaDocenteRequest administrativo;
}
