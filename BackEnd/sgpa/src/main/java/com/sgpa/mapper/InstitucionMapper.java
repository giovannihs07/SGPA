package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.InstitucionRequest;
import com.sgpa.dto.response.InstitucionResponse;
import com.sgpa.model.Institucion;

@Component
public class InstitucionMapper {

    public InstitucionResponse toResponse(Institucion institucion) {
        return InstitucionResponse.builder()
            .id(institucion.getId())
            .nombre(institucion.getNombre())
            .nit(institucion.getNit())
            .ciudad(institucion.getCiudad())
            .pais(institucion.getPais())
            .build();
    }

    public List<InstitucionResponse> toResponseList(List<Institucion> instituciones) {
        return instituciones.stream()
            .map(this::toResponse)
            .toList();
    }

    public Institucion toEntity(InstitucionRequest request) {
        Institucion institucion = new Institucion();
        institucion.setNombre(request.getNombre());
        institucion.setNit(request.getNit());
        institucion.setCiudad(request.getCiudad());
        institucion.setPais(request.getPais());
        return institucion;
    }
}
