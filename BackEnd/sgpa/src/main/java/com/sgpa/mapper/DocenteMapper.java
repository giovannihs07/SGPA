package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.DocenteRequest;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.model.Docente;

@Component
public class DocenteMapper {

    public DocenteResponse toResponse(Docente docente) {
        String programaNombre = docente.getPrograma() != null ? docente.getPrograma().getNombre() : null;
        Long programaId = docente.getPrograma() != null ? docente.getPrograma().getId() : null;
        
        return DocenteResponse.builder()
            .id(docente.getId())
            .nombre(docente.getNombre())
            .apellido(docente.getApellido())
            .cedula(docente.getCedula())
            .telefono(docente.getTelefono())
            .codigoDocente(docente.getCodigoDocente())
            .titulo(docente.getTitulo())
            .tipoContrato(docente.getTipoContrato())
            .programaId(programaId)
            .programaNombre(programaNombre)
            .build();
    }

    public List<DocenteResponse> toResponseList(List<Docente> docentes) {
        return docentes.stream()
            .map(this::toResponse)
            .toList();
    }

    public Docente toEntity(DocenteRequest request) {
        Docente docente = new Docente();
        docente.setNombre(request.getNombre());
        docente.setApellido(request.getApellido());
        docente.setCedula(request.getCedula());
        docente.setTelefono(request.getTelefono());
        docente.setCodigoDocente(request.getCodigoDocente());
        docente.setTitulo(request.getTitulo());
        docente.setTipoContrato(request.getTipoContrato());
        return docente;
    }
}
