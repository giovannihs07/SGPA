package com.sgpa.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.UserRegisterRequest;
import com.sgpa.dto.response.UserRegisterResponse;
import com.sgpa.model.Persona;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.User;

@Component
public class UserRegisterMapper {

    /**
     * Convierte un UserRegisterRequest a una entidad User
     * 
     * @param request - UserRegisterRequest con datos de registro
     * @return User entity con los datos básicos del registro
     */
    public User toEntity(UserRegisterRequest request) {
        if (request == null) {
            return null;
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        return user;
    }

    /**
     * Convierte una entidad User a un UserRegisterResponse
     * Incluye información del usuario, roles y datos de la persona asociada
     * 
     * @param user - Entidad User
     * @return UserRegisterResponse con datos del usuario y persona
     */
    public UserRegisterResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        
        List<String> roles = user.getRoles() != null 
            ? user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList())
            : List.of();
        
        UserRegisterResponse.UserRegisterResponseBuilder builder = UserRegisterResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .roles(roles);
        
        // Agregar datos de la persona asociada si existe
        if (user.getPersona() != null) {
            Persona persona = user.getPersona();
            builder.personaId(persona.getId())
                   .nombre(persona.getNombre())
                   .apellido(persona.getApellido())
                   .cedula(persona.getCedula())
                   .telefono(persona.getTelefono());
        }
        
        return builder.build();
    }

    /**
     * Convierte una lista de Users a lista de UserRegisterResponse
     * 
     * @param users - Lista de entidades User
     * @return Lista de UserRegisterResponse
     */
    public List<UserRegisterResponse> toResponseList(List<User> users) {
        if (users == null) {
            return List.of();
        }
        
        return users.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
