package com.sgpa.dto.response;

import com.sgpa.model.users.RoleName;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {

    private Long id;
    private RoleName name;
}
