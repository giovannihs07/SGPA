package com.sgpa.mapper;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.UserLoginResponse;
import com.sgpa.model.users.Role;
import com.sgpa.model.users.RoleName;
import com.sgpa.model.users.User;

@Component
public class UserLoginMapper {

    public UserLoginResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserLoginResponse.builder()
            .id(user.getId())
            .email(user.getEmail())
            .roles(mapRoles(user.getRoles()))
            .build();
    }

    public List<UserLoginResponse> toResponseList(List<User> users) {
        if (users == null) {
            return List.of();
        }
        return users.stream().map(this::toResponse).collect(Collectors.toList());
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
