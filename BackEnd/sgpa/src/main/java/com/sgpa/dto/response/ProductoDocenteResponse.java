package com.sgpa.dto.response;

import java.time.LocalDate;
import java.util.Map;
import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDocenteResponse {

    private Long id;
    private String nombre;
    private String descripcion;
    private String tipo;
    private String subcategoria;
    private String categoria;
    private Boolean publicado;
    private String nombreArchivo;
    private String nombreArchivoOriginal;
    private LocalDate fechaCreacion;
    private LocalDate fechaPublicacion;
    private Map<String, Object> atributos;

    // Datos del docente para reportes
    private Long docenteId;
    private String docenteNombre;
    private String docenteApellido;
    private String docenteCodigo;
    private Set<String> programas;
}
