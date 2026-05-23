package com.sgpa.dto.request;

import com.sgpa.model.users.RoleName;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleRequest {
    
    @NotNull(message = "El nombre del rol no puede ser nulo")
    private RoleName nombre;
}
