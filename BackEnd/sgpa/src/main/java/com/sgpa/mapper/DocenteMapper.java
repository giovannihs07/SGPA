package com.sgpa.mapper;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.RegistroDocenteRequest;
import com.sgpa.dto.response.DocenteResponse;
import com.sgpa.dto.response.ProgramaResponse;
import com.sgpa.dto.response.TituloAcademicoResponse;
import com.sgpa.model.Docente;
import com.sgpa.model.Persona;
import com.sgpa.model.Programa;
import com.sgpa.model.users.User;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DocenteMapper {

    public DocenteResponse toDTO(Docente docente) {
        Persona persona = docente.getPersona();
        User user = persona != null ? persona.getUser() : null;

        Set<String> roles = user != null
            ? user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet())
            : Set.of();

        Set<ProgramaResponse> programas = docente.getProgramas().stream()
            .map(p -> ProgramaResponse.builder()
                .id(p.getId())
                .nombre(p.getNombre())
                .codigo(p.getCodigo())
                .nivel(p.getNivel().name())
                .facultadId(p.getFacultad() != null
                    ? p.getFacultad().getId() : null)
                .facultadNombre(p.getFacultad() != null
                    ? p.getFacultad().getNombre() : null)
                .build())
            .collect(Collectors.toSet());

        List<TituloAcademicoResponse> titulos = docente.getTitulos() != null
            ? docente.getTitulos().stream()
                .map(t -> TituloAcademicoResponse.builder()
                    .id(t.getId())
                    .titulo(t.getTitulo())
                    .nivel(t.getNivel().name())
                    .institucion(t.getInstitucion())
                    .fechaObtencion(t.getFechaObtencion())
                    .pais(t.getPais())
                    .build())
                .toList()
            : List.of();

        return DocenteResponse.builder()
            .id(docente.getId())
            .nombre(persona != null ? persona.getNombre() : null)
            .apellido(persona != null ? persona.getApellido() : null)
            .cedula(persona != null ? persona.getCedula() : null)
            .telefono(persona != null ? persona.getTelefono() : null)
            .fechaCreacion(persona != null ? persona.getFechaCreacion() : null)
            .email(user != null ? user.getEmail() : null)
            .activo(user != null ? user.getActivo() : null)
            .roles(roles)
            .codigoDocente(docente.getCodigoDocente())
            .tipoContrato(docente.getTipoContrato())
            .programas(programas)
            .titulos(titulos)
            .build();
    }

    public List<DocenteResponse> toDTOList(List<Docente> docentes) {
        return docentes.stream().map(this::toDTO).toList();
    }
}
