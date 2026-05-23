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
import com.sgpa.model.Facultad;
import com.sgpa.model.Institucion;
import com.sgpa.model.Persona;
import com.sgpa.model.Programa;
import com.sgpa.model.users.User;
import com.sgpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DocenteMapper {

    private final UserRepository userRepository;

    public DocenteResponse toDTO(Docente docente) {
        Persona persona = docente.getPersona();

        User user = persona != null
            ? userRepository.findByPersonaId(persona.getId()).orElse(null)
            : null;

        return buildResponse(docente, persona, user);
    }

    // Sobrecarga 
    public DocenteResponse toDTO(Docente docente, User user) {
        Persona persona = docente.getPersona();
        return buildResponse(docente, persona, user);
    }

    public List<DocenteResponse> toDTOList(List<Docente> docentes) {
        return docentes.stream().map(this::toDTO).toList();
    }

    private DocenteResponse buildResponse(Docente docente,
            Persona persona, User user) {

        Set<String> roles = user != null
            ? user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet())
            : Set.of();

        Set<ProgramaResponse> programas = docente.getProgramas() != null
            ? docente.getProgramas().stream()
                .map(p -> {
                    Facultad facultad = p.getFacultad();
                    Institucion institucion = facultad != null
                        ? facultad.getInstitucion() : null;

                    return ProgramaResponse.builder()
                        .id(p.getId())
                        .nombre(p.getNombre())
                        .codigo(p.getCodigo())
                        .nivel(p.getNivel() != null ? p.getNivel().name() : null)
                        .facultadId(facultad != null ? facultad.getId() : null)
                        .facultadNombre(facultad != null
                            ? facultad.getNombre() : null)
                        .institucionId(institucion != null
                            ? institucion.getId() : null)
                        .institucionNombre(institucion != null
                            ? institucion.getNombre() : null)
                        .build();
                })
                .collect(Collectors.toSet())
            : Set.of();

        List<TituloAcademicoResponse> titulos = docente.getTitulos() != null
            ? docente.getTitulos().stream()
                .map(t -> TituloAcademicoResponse.builder()
                    .id(t.getId())
                    .titulo(t.getTitulo())
                    .nivel(t.getNivel() != null ? t.getNivel().name() : null)
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
            .estado(user != null ? user.getEstado().name() : null)
            .roles(roles)
            .codigoDocente(docente.getCodigoDocente())
            .tipoContrato(docente.getTipoContrato())
            .programas(programas)
            .titulos(titulos)
            .build();
    }
}
