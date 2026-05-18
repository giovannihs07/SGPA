package com.sgpa.dto.request;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DocenteRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    private String cedula;
    private String telefono;

    private String codigoDocente;
    private String tipoContrato;

    @Valid
    private List<TituloAcademicoRequest> titulos;

    @NotEmpty(message = "Debe asignar al menos un programa")
    private List<Long> programaIds;
}
