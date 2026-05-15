package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.ProgramaRequest;
import com.sgpa.dto.response.ProgramaResponse;
import com.sgpa.model.Programa;

@Component
public class ProgramaMapper {

    public ProgramaResponse toResponse(Programa programa) {
        String facultadNombre = programa.getFacultad() != null ? programa.getFacultad().getNombre() : null;
        Long facultadId = programa.getFacultad() != null ? programa.getFacultad().getId() : null;
        
        return ProgramaResponse.builder()
            .id(programa.getId())
            .nombre(programa.getNombre())
            .codigo(programa.getCodigo())
            .nivel(programa.getNivel())
            .facultadId(facultadId)
            .facultadNombre(facultadNombre)
            .build();
    }

    public List<ProgramaResponse> toResponseList(List<Programa> programas) {
        return programas.stream()
            .map(this::toResponse)
            .toList();
    }

    public Programa toEntity(ProgramaRequest request) {
        Programa programa = new Programa();
        programa.setNombre(request.getNombre());
        programa.setCodigo(request.getCodigo());
        programa.setNivel(request.getNivel());
        return programa;
    }
}
