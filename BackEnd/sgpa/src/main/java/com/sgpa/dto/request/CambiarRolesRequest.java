package com.sgpa.dto.request;

import java.util.Set;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CambiarRolesRequest {
    @NotEmpty
    private Set<String> roles;
}
