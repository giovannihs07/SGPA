package com.sgpa.dto.request;

import com.sgpa.model.institucion.NivelFormacion;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProgramaRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El código es obligatorio")
    private String codigo;

    @NotNull(message = "El nivel es obligatorio")
    private NivelFormacion nivel;

    @NotNull(message = "La facultad es obligatoria")
    private Long facultadId;
}
