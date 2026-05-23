package com.sgpa.dto.request;

import java.time.LocalDate;

import com.sgpa.model.NivelAcademico;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TituloAcademicoRequest {

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    @NotNull(message = "El nivel académico es obligatorio")
    private NivelAcademico nivel;

    @NotBlank(message = "La institución es obligatoria")
    private String institucion;

    private LocalDate fechaObtencion;
    private String pais;
}
