package com.proyectogrado.sgpa.dto;

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
    private String estado;
    private String descripcion;
    private String url;
    private String categoria;
    private String subcategoria;
    private String tipo;
    private LocalDate fechaCreacion;
    private Map<String, Object> atributos;
}
