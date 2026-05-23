package com.sgpa.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.sgpa.dto.request.RoleRequest;
import com.sgpa.dto.response.RoleResponse;
import com.sgpa.model.users.Role;

@Component
public class RoleMapper {

    public RoleResponse toDTO(Role role) {
        return RoleResponse.builder()
            .id(role.getId())
            .nombre(role.getName().name())
            .build();
    }

    public List<RoleResponse> toDTOList(List<Role> roles) {
        return roles.stream().map(this::toDTO).toList();
    }

    public Role toEntity(RoleRequest request) {
        Role role = new Role();
        role.setName(request.getNombre());
        return role;
    }

    public void updateEntity(RoleRequest request, Role role) {
        role.setName(request.getNombre());
    }
}
