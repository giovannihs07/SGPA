package com.sgpa.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.TituloAcademicoRequest;
import com.sgpa.dto.response.TituloAcademicoResponse;
import com.sgpa.model.Docente;
import com.sgpa.model.TituloAcademico;

@Component
public class TituloAcademicoMapper {

    public TituloAcademicoResponse toResponse(TituloAcademico titulo) {
        if (titulo == null) {
            return null;
        }

        return TituloAcademicoResponse.builder()
            .id(titulo.getId())
            .titulo(titulo.getTitulo())
            .nivel(titulo.getNivel())
            .institucion(titulo.getInstitucion())
            .fechaObtencion(titulo.getFechaObtencion())
            .pais(titulo.getPais())
            .build();
    }

    public List<TituloAcademicoResponse> toResponseList(List<TituloAcademico> titulos) {
        if (titulos == null) {
            return List.of();
        }
        return titulos.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TituloAcademico toEntity(TituloAcademicoRequest request, Docente docente) {
        if (request == null) {
            return null;
        }

        TituloAcademico titulo = new TituloAcademico();
        titulo.setId(request.getId());
        titulo.setTitulo(request.getTitulo());
        titulo.setNivel(request.getNivel());
        titulo.setInstitucion(request.getInstitucion());
        titulo.setFechaObtencion(request.getFechaObtencion());
        titulo.setPais(request.getPais());
        titulo.setDocente(docente);
        return titulo;
    }

    public void updateEntity(TituloAcademico titulo, TituloAcademicoRequest request) {
        if (titulo == null || request == null) {
            return;
        }

        titulo.setTitulo(request.getTitulo());
        titulo.setNivel(request.getNivel());
        titulo.setInstitucion(request.getInstitucion());
        titulo.setFechaObtencion(request.getFechaObtencion());
        titulo.setPais(request.getPais());
    }
}
