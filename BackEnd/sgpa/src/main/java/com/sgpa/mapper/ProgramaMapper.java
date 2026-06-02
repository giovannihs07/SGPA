package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.ProgramaResponse;
import com.sgpa.model.institucion.Facultad;
import com.sgpa.model.institucion.Institucion;
import com.sgpa.model.institucion.Programa;

@Component
public class ProgramaMapper {

    public ProgramaResponse toDTO(Programa programa) {
        Facultad facultad = programa.getFacultad();
        Institucion institucion = facultad != null
            ? facultad.getInstitucion() : null;

        return ProgramaResponse.builder()
            .id(programa.getId())
            .nombre(programa.getNombre())
            .codigo(programa.getCodigo())
            .nivel(programa.getNivel().name())
            .facultadId(facultad != null ? facultad.getId() : null)
            .facultadNombre(facultad != null ? facultad.getNombre() : null)
            .institucionId(institucion != null ? institucion.getId() : null)
            .institucionNombre(institucion != null
                ? institucion.getNombre() : null)
            .build();
    }

    public List<ProgramaResponse> toDTOList(List<Programa> programas) {
        return programas.stream().map(this::toDTO).toList();
    }
}
