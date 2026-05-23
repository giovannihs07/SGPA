package com.sgpa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter @AllArgsConstructor
public class DocenteAdministrativoResponse {
    private DocenteResponse docente;
    private AdministrativoResponse administrativo;
}

