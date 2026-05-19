package com.sgpa.dto.request;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistroDocenteRequest {

    // Datos de Persona
    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellido;

    @NotBlank(message = "La cédula es obligatoria")
    private String cedula;

    private String telefono;

    // Datos de User
    @NotBlank
    @Email
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@unicartagena\\.edu\\.co$",
        message = "El email debe ser institucional"
    )
    private String email;

    @NotBlank
    @Size(min = 8, max = 100)
    private String password;

    // Datos de Docente
    private String codigoDocente;
    private String tipoContrato;
    private Set<Long> programaIds = new HashSet<>();
    private List<TituloAcademicoRequest> titulos = new ArrayList<>();
}
