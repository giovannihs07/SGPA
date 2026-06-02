package com.sgpa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TipoProductoAtributoResponse {
    private Long id;
    private String nombreAtributo;
    private String etiqueta;
    private String tipoDato;
    private Boolean requerido;
    private Integer orden;
    private String opciones;
}
