package com.sgpa.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.UserRegisterRequest;
import com.sgpa.dto.response.UserRegisterResponse;
import com.sgpa.model.Persona;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.model.users.User;

@Component
public class UserRegisterMapper {

    public User toEntity(UserRegisterRequest request) {
        if (request == null) {
            return null;
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setActivo(true);
        return user;
    }

    public UserRegisterResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        UserRegisterResponse.UserRegisterResponseBuilder builder = UserRegisterResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .roles(mapRoles(user.getRoles()));

        Persona persona = user.getPersona();
        if (persona != null) {
            builder.personaId(persona.getId())
                .nombre(persona.getNombre())
                .apellido(persona.getApellido())
                .cedula(persona.getCedula())
                .telefono(persona.getTelefono());
        }

        return builder.build();
    }

    private List<RoleName> mapRoles(Set<Role> roles) {
        if (roles == null) {
            return List.of();
        }
        return roles.stream()
            .map(Role::getName)
            .collect(Collectors.toList());
    }
}
