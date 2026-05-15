package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.FacultadRequest;
import com.sgpa.dto.response.FacultadResponse;
import com.sgpa.model.Facultad;

@Component
public class FacultadMapper {

    public FacultadResponse toResponse(Facultad facultad) {
        String institucionNombre = facultad.getInstitucion() != null ? facultad.getInstitucion().getNombre() : null;
        Long institucionId = facultad.getInstitucion() != null ? facultad.getInstitucion().getId() : null;
        
        return FacultadResponse.builder()
            .id(facultad.getId())
            .nombre(facultad.getNombre())
            .institucionId(institucionId)
            .institucionNombre(institucionNombre)
            .build();
    }

    public List<FacultadResponse> toResponseList(List<Facultad> facultades) {
        return facultades.stream()
            .map(this::toResponse)
            .toList();
    }

    public Facultad toEntity(FacultadRequest request) {
        Facultad facultad = new Facultad();
        facultad.setNombre(request.getNombre());
        return facultad;
    }
}
