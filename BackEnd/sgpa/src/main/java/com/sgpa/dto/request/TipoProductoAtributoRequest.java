package com.sgpa.dto.request;

import com.sgpa.model.products.TipoDato;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class TipoProductoAtributoRequest {

    @NotBlank(message = "El nombre del atributo es obligatorio")
    private String nombreAtributo;

    @NotBlank(message = "La etiqueta es obligatoria")
    private String etiqueta;

    @NotNull(message = "El tipo de dato es obligatorio")
    private TipoDato tipoDato;

    private Boolean requerido = true;
    private Integer orden;
    private String opciones; // solo para tipoDato = SELECT
}
