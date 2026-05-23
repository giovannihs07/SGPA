package com.sgpa.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

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
public class DocenteResponse {

    private Long id;

    // Datos de Persona
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
    private LocalDateTime fechaCreacion;

    // Datos de User
    private String email;
    private String estado;
    private Set<String> roles;

    // Datos de Docente
    private String codigoDocente;
    private String tipoContrato;
    private Set<ProgramaResponse> programas;
    private List<TituloAcademicoResponse> titulos;
}
