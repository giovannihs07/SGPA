package com.sgpa.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.UserRequest;
import com.sgpa.dto.response.TituloAcademicoResponse;
import com.sgpa.dto.response.UserResponse;
import com.sgpa.dto.response.UserResponse.PersonaResumen;
import com.sgpa.model.Persona;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.model.users.User;
import com.sgpa.repository.AdministrativoRepository;
import com.sgpa.repository.DocenteRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UserMapper {

    private final DocenteRepository docenteRepository;
    private final AdministrativoRepository administrativoRepository;
    private final TituloAcademicoMapper tituloAcademicoMapper;

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .activo(user.getActivo())
            .fechaCreacion(user.getFechaCreacion())
            .roles(mapRoles(user.getRoles()))
            .persona(mapPersona(user.getPersona()))
            .build();
    }

    public List<UserResponse> toResponseList(List<User> users) {
        if (users == null) {
            return List.of();
        }
        return users.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public User toEntity(UserRequest request) {
        if (request == null) {
            return null;
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setActivo(request.getActivo() != null ? request.getActivo() : true);
        return user;
    }

    public void updateEntity(User user, UserRequest request) {
        if (user == null || request == null) {
            return;
        }

        user.setEmail(request.getEmail());
        if (request.getActivo() != null) {
            user.setActivo(request.getActivo());
        }
    }

    public PersonaResumen mapPersona(Persona persona) {
        if (persona == null) {
            return null;
        }

        PersonaResumen.PersonaResumenBuilder builder = PersonaResumen.builder()
            .id(persona.getId())
            .nombre(persona.getNombre())
            .apellido(persona.getApellido())
            .cedula(persona.getCedula())
            .telefono(persona.getTelefono());

        var docenteOpt = docenteRepository.findByPersonaId(persona.getId());
        if (docenteOpt.isPresent()) {
            var docente = docenteOpt.get();
            List<TituloAcademicoResponse> titulos = tituloAcademicoMapper.toResponseList(docente.getTitulos());
            return builder.tipo("DOCENTE")
                .codigoDocente(docente.getCodigoDocente())
                .titulos(titulos)
                .tipoContrato(docente.getTipoContrato())
                .build();
        }

        var administrativoOpt = administrativoRepository.findByPersonaId(persona.getId());
        if (administrativoOpt.isPresent()) {
            var administrativo = administrativoOpt.get();
            return builder.tipo("ADMINISTRATIVO")
                .cargo(administrativo.getCargo())
                .tipoContrato(administrativo.getTipoContrato())
                .dependencia(administrativo.getDependencia())
                .build();
        }

        return builder.tipo("PERSONA").build();
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
