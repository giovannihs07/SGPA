package com.sgpa.mapper;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.RoleResponse;
import com.sgpa.model.users.Role;

@Component
public class RoleMapper {

    public RoleResponse toResponse(Role role) {
        if (role == null) {
            return null;
        }

        return RoleResponse.builder()
            .id(role.getId())
            .name(role.getName())
            .build();
    }

    public List<RoleResponse> toResponseList(Iterable<Role> roles) {
        if (roles == null) {
            return List.of();
        }

        List<RoleResponse> response = new ArrayList<>();
        roles.forEach(role -> response.add(toResponse(role)));
        return response;
    }
}
