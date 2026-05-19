package com.sgpa.dto.response;

import java.time.LocalDate;

import com.sgpa.model.NivelAcademico;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TituloAcademicoResponse {

    private Long id;
    private String titulo;
    private String nivel;
    private String institucion;
    private LocalDate fechaObtencion;
    private String pais;
}
