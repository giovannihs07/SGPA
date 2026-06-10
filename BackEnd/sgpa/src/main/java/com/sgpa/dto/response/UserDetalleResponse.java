package com.sgpa.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class UserDetalleResponse {

    // Datos del User
    private Long userId;
    private String email;
    private String estado;
    private Set<String> roles;
    private LocalDateTime fechaRegistro;

    // Datos de Persona
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;

    // Perfil Docente 
    private Long docenteId;
    private String codigoDocente;
    private String tipoContratoDocente;
    private Set<ProgramaResponse> programas;
    private List<TituloAcademicoResponse> titulos;

    // Perfil Administrativo 
    private Long administrativoId;
    private String cargo;
    private String dependencia;
}
