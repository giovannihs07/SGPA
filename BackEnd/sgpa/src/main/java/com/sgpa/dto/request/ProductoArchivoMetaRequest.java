package com.sgpa.dto.request;

import com.sgpa.model.products.RolArchivoProducto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ProductoArchivoMetaRequest {

    @NotNull(message = "El rol del archivo es obligatorio")
    private RolArchivoProducto rol;

    private Integer orden;
}
