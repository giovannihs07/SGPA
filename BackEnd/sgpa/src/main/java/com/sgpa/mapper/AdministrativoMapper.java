package com.sgpa.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.AdministrativoRequest;
import com.sgpa.dto.request.PersonaRequest;
import com.sgpa.dto.response.AdministrativoResponse;
import com.sgpa.model.Administrativo;
import com.sgpa.model.Persona;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdministrativoMapper {

    private final PersonaMapper personaMapper;

    public AdministrativoResponse toResponse(Administrativo administrativo) {
        if (administrativo == null) {
            return null;
        }

        AdministrativoResponse.AdministrativoResponseBuilder builder = AdministrativoResponse.builder()
            .id(administrativo.getId())
            .cargo(administrativo.getCargo())
            .tipoContrato(administrativo.getTipoContrato())
            .dependencia(administrativo.getDependencia());

        Persona persona = administrativo.getPersona();
        if (persona != null) {
            builder.personaId(persona.getId())
                .nombre(persona.getNombre())
                .apellido(persona.getApellido())
                .cedula(persona.getCedula())
                .telefono(persona.getTelefono());
        }

        return builder.build();
    }

    public List<AdministrativoResponse> toResponseList(List<Administrativo> administrativos) {
        if (administrativos == null) {
            return List.of();
        }
        return administrativos.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public Persona toPersonaEntity(AdministrativoRequest request) {
        return personaMapper.toEntity(new PersonaRequest(
            request.getNombre(),
            request.getApellido(),
            request.getCedula(),
            request.getTelefono()
        ));
    }

    public void updatePersona(Persona persona, AdministrativoRequest request) {
        personaMapper.updateEntity(persona, new PersonaRequest(
            request.getNombre(),
            request.getApellido(),
            request.getCedula(),
            request.getTelefono()
        ));
    }

    public Administrativo toAdministrativo(AdministrativoRequest request, Persona persona) {
        Administrativo administrativo = new Administrativo();
        administrativo.setPersona(persona);
        administrativo.setCargo(request.getCargo());
        administrativo.setTipoContrato(request.getTipoContrato());
        administrativo.setDependencia(request.getDependencia());
        return administrativo;
    }

    public void updateAdministrativoFields(Administrativo administrativo, AdministrativoRequest request) {
        administrativo.setCargo(request.getCargo());
        administrativo.setTipoContrato(request.getTipoContrato());
        administrativo.setDependencia(request.getDependencia());
    }
}
