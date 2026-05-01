package com.proyectogrado.sgpa.dto;

import java.util.Map;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// request/ProductoDocenteRequestDTO.java
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDocenteRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El tipo es obligatorio")
    private String tipo; // debe coincidir con un valor del enum TipoProducto

    private String descripcion;
    private String url;
    private String estado; 

    @NotNull(message = "Los atributos son obligatorios")
    private Map<String, Object> atributos;
}
