package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.FacultadRequest;
import com.sgpa.dto.response.FacultadResponse;
import com.sgpa.model.Facultad;

@Component
public class FacultadMapper {

    public FacultadResponse toDTO(Facultad facultad) {
        return FacultadResponse.builder()
            .id(facultad.getId())
            .nombre(facultad.getNombre())
            .codigo(facultad.getCodigo())
            .institucionId(facultad.getInstitucion() != null
                ? facultad.getInstitucion().getId() : null)
            .institucionNombre(facultad.getInstitucion() != null
                ? facultad.getInstitucion().getNombre() : null)
            .build();
    }

    public List<FacultadResponse> toDTOList(List<Facultad> facultades) {
        return facultades.stream().map(this::toDTO).toList();
    }
}
