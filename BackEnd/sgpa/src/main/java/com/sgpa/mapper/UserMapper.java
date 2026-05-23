package com.sgpa.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.UserResumenResponse;
import com.sgpa.dto.response.RoleResponse;

import com.sgpa.model.Persona;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.User;

@Component
public class UserMapper {

    public UserResumenResponse toDTO(User user) {
        Persona persona = user.getPersona();

        Set<String> roles = user.getRoles().stream()
            .map(r -> r.getName().name())
            .collect(Collectors.toSet());

        return UserResumenResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .estado(user.getEstado().name())
            .roles(roles)
            .personaId(persona != null ? persona.getId() : null)
            .nombre(persona != null ? persona.getNombre() : null)
            .apellido(persona != null ? persona.getApellido() : null)
            .cedula(persona != null ? persona.getCedula() : null)
            .telefono(persona != null ? persona.getTelefono() : null)
            .build();
    }

    public List<UserResumenResponse> toDTOList(List<User> users) {
        return users.stream().map(this::toDTO).toList();
    }

}
