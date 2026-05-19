package com.sgpa.mapper;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.DocenteRequest;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.dto.response.DocenteResponse.ProgramaDocenteDTO;
import com.sgpa.model.Docente;
import com.sgpa.model.Persona;
import com.sgpa.model.Programa;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DocenteMapper {

    private final PersonaMapper personaMapper;
    private final TituloAcademicoMapper tituloAcademicoMapper;

    public DocenteResponse toResponse(Docente docente) {
        if (docente == null) {
            return null;
        }

        Persona persona = docente.getPersona();
        List<ProgramaDocenteDTO> programas = docente.getProgramas() != null
            ? docente.getProgramas().stream()
                .map(this::mapPrograma)
                .collect(Collectors.toList())
            : List.of();

        DocenteResponse.DocenteResponseBuilder builder = DocenteResponse.builder()
            .id(docente.getId())
            .codigoDocente(docente.getCodigoDocente())
            .tipoContrato(docente.getTipoContrato())
            .titulos(tituloAcademicoMapper.toResponseList(docente.getTitulos()))
            .programas(programas);

        if (persona != null) {
            builder.personaId(persona.getId())
                .nombre(persona.getNombre())
                .apellido(persona.getApellido())
                .cedula(persona.getCedula())
                .telefono(persona.getTelefono());
        }

        return builder.build();
    }

    public List<DocenteResponse> toResponseList(List<Docente> docentes) {
        if (docentes == null) {
            return List.of();
        }

        return docentes.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Persona toPersonaEntity(DocenteRequest request) {
        return personaMapper.toEntity(new com.sgpa.dto.request.PersonaRequest(
            request.getNombre(),
            request.getApellido(),
            request.getCedula(),
            request.getTelefono()
        ));
    }

    public void updatePersona(Persona persona, DocenteRequest request) {
        personaMapper.updateEntity(persona, new com.sgpa.dto.request.PersonaRequest(
            request.getNombre(),
            request.getApellido(),
            request.getCedula(),
            request.getTelefono()
        ));
    }

    public void updateDocenteFields(Docente docente, DocenteRequest request) {
        if (docente == null || request == null) {
            return;
        }

        docente.setCodigoDocente(request.getCodigoDocente());
        docente.setTipoContrato(request.getTipoContrato());
    }

    public Docente toDocente(DocenteRequest request, Persona persona) {
        Docente docente = new Docente();
        docente.setPersona(persona);
        docente.setCodigoDocente(request.getCodigoDocente());
        docente.setTipoContrato(request.getTipoContrato());
        docente.setProgramas(new HashSet<>());
        return docente;
    }

    private ProgramaDocenteDTO mapPrograma(Programa programa) {
        return ProgramaDocenteDTO.builder()
            .id(programa.getId())
            .nombre(programa.getNombre())
            .codigo(programa.getCodigo())
            .nivel(programa.getNivel().name())
            .build();
    }
}
