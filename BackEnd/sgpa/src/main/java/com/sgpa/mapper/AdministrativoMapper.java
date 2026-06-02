package com.sgpa.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.AdministrativoResponse;
import com.sgpa.model.users.Administrativo;
import com.sgpa.model.users.Persona;
import com.sgpa.model.users.User;
import com.sgpa.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AdministrativoMapper {

    private final UserRepository userRepository;

    public AdministrativoResponse toDTO(Administrativo administrativo) {
        Persona persona = administrativo.getPersona();
        User user = persona != null
            ? userRepository.findByPersonaId(persona.getId()).orElse(null)
            : null;
        return buildResponse(administrativo, persona, user);
    }

    public AdministrativoResponse toDTO(Administrativo administrativo, User user) {
        Persona persona = administrativo.getPersona();
        return buildResponse(administrativo, persona, user);
    }

    public List<AdministrativoResponse> toDTOList(List<Administrativo> administrativos) {
        return administrativos.stream().map(this::toDTO).toList();
    }

    private AdministrativoResponse buildResponse(Administrativo administrativo,
            Persona persona, User user) {

        Set<String> roles = user != null
            ? user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet())
            : Set.of();

        return AdministrativoResponse.builder()
            .id(administrativo.getId())
            .nombre(persona != null ? persona.getNombre() : null)
            .apellido(persona != null ? persona.getApellido() : null)
            .cedula(persona != null ? persona.getCedula() : null)
            .telefono(persona != null ? persona.getTelefono() : null)
            .fechaCreacion(persona != null
                ? persona.getFechaCreacion() : null)
            .email(user != null ? user.getEmail() : null)
            .estado(user != null ? user.getEstado().name() : null)
            .roles(roles)
            .cargo(administrativo.getCargo())
            .dependencia(administrativo.getDependencia())
            .build();
    }
}
