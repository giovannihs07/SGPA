package com.sgpa.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.UserLoginRequest;
import com.sgpa.dto.response.UserLoginResponse;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.User;

@Component
public class UserLoginMapper {

    /**
     * Convierte un UserLoginRequest a una entidad User
     * 
     * @param request - UserLoginRequest con email y password
     * @return User entity con los datos básicos del login
     */
    public User toEntity(UserLoginRequest request) {
        if (request == null) {
            return null;
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        return user;
    }

    /**
     * Convierte una entidad User a un UserLoginResponse
     * Incluye información básica del usuario y sus roles
     * 
     * @param user - Entidad User
     * @return UserLoginResponse con datos del usuario
     */
    public UserLoginResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        
        List<String> roles = user.getRoles() != null 
            ? user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList())
            : List.of();
        
        return UserLoginResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .roles(roles)
            .build();
    }

    /**
     * Convierte una lista de Users a lista de UserLoginResponse
     * 
     * @param users - Lista de entidades User
     * @return Lista de UserLoginResponse
     */
    public List<UserLoginResponse> toResponseList(List<User> users) {
        if (users == null) {
            return List.of();
        }
        
        return users.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
