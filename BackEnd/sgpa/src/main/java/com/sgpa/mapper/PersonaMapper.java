package com.sgpa.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.PersonaRequest;
import com.sgpa.dto.response.PersonaResponse;
import com.sgpa.model.Persona;

@Component
public class PersonaMapper {

    public PersonaResponse toResponse(Persona persona) {
        if (persona == null) {
            return null;
        }

        return PersonaResponse.builder()
            .id(persona.getId())
            .nombre(persona.getNombre())
            .apellido(persona.getApellido())
            .cedula(persona.getCedula())
            .telefono(persona.getTelefono())
            .fechaCreacion(persona.getFechaCreacion())
            .build();
    }

    public List<PersonaResponse> toResponseList(List<Persona> personas) {
        if (personas == null) {
            return List.of();
        }
        return personas.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Persona toEntity(PersonaRequest request) {
        if (request == null) {
            return null;
        }

        Persona persona = new Persona();
        persona.setNombre(request.getNombre());
        persona.setApellido(request.getApellido());
        persona.setCedula(request.getCedula());
        persona.setTelefono(request.getTelefono());
        return persona;
    }

    public void updateEntity(Persona persona, PersonaRequest request) {
        if (persona == null || request == null) {
            return;
        }

        persona.setNombre(request.getNombre());
        persona.setApellido(request.getApellido());
        persona.setCedula(request.getCedula());
        persona.setTelefono(request.getTelefono());
    }
}
