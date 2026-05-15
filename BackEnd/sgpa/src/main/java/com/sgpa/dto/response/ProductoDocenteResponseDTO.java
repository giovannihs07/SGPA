package com.sgpa.dto.response;

import java.time.LocalDate;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoDocenteResponseDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private String nombreArchivo;
    private String nombreArchivoOriginal;
    private Boolean publicado;
    private String categoria;
    private String subcategoria;
    private String tipo;
    private LocalDate fechaCreacion;
    private LocalDate fechaPublicacion;
    private Map<String, Object> atributos;
    
    // Información del docente
    private Long docenteId;
    private String docenteNombre;
    private String docenteApellido;
    private String docenteCodigoDocente;
}
