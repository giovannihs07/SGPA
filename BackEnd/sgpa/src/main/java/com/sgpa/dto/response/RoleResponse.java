package com.sgpa.dto.response;

import com.sgpa.model.users.RoleName;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class RoleResponse {
    private Long id;
    private String nombre;
}
