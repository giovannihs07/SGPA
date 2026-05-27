package com.sgpa.dto.request;

import java.util.Set;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AprobarUsuarioRequest {

    @NotEmpty(message = "Debe asignar al menos un rol")
    private Set<String> roles;
}
