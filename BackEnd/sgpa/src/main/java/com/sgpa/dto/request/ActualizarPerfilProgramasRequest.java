package com.sgpa.dto.request;

import java.util.HashSet;
import java.util.Set;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ActualizarPerfilProgramasRequest {

    @NotEmpty(message = "Debe asignar al menos un programa")
    private Set<Long> programaIds = new HashSet<>();
}
