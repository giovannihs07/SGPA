package com.sgpa.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.sgpa.model.users.RoleName;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    private Long id;
    private String email;
    private Boolean activo;
    private LocalDate fechaCreacion;
    private List<RoleName> roles;
    private PersonaResumen persona;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PersonaResumen {
        private Long id;
        private String tipo;
        private String nombre;
        private String apellido;
        private String cedula;
        private String telefono;
        private String codigoDocente;
        private List<TituloAcademicoResponse> titulos;
        private String tipoContrato;
        private String cargo;
        private String dependencia;
    }
}
