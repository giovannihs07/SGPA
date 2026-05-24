package com.sgpa.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoleResponse {
    private Long id;
    private String nombre;
}
