package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.InstitucionRequest;
import com.sgpa.dto.response.InstitucionResponse;
import com.sgpa.model.Institucion;

@Component
public class InstitucionMapper {

    public InstitucionResponse toDTO(Institucion institucion) {
        return InstitucionResponse.builder()
            .id(institucion.getId())
            .nombre(institucion.getNombre())
            .nit(institucion.getNit())
            .ciudad(institucion.getCiudad())
            .pais(institucion.getPais())
            .build();
    }

    public List<InstitucionResponse> toDTOList(List<Institucion> instituciones) {
        return instituciones.stream()
            .map(this::toDTO)
            .toList();
    }

    public Institucion toEntity(InstitucionRequest dto) {
        Institucion institucion = new Institucion();
        institucion.setNombre(dto.getNombre());
        institucion.setNit(dto.getNit());
        institucion.setCiudad(dto.getCiudad());
        institucion.setPais(dto.getPais());
        return institucion;
    }
}
