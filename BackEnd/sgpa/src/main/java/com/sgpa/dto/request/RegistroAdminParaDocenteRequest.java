package com.sgpa.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistroAdminParaDocenteRequest {
    @NotBlank
    private String cargo;
    private String dependencia;
}
