package com.sgpa.dto.response;

import java.time.LocalDateTime;

import com.sgpa.model.products.RolArchivoProducto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ProductoArchivoResponse {

    private Long id;
    private String nombreOriginal;
    private RolArchivoProducto rol;
    private Integer orden;
    private String extensionArchivo;
    private LocalDateTime fechaSubida;
}
