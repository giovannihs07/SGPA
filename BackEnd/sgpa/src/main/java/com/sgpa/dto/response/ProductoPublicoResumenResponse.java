package com.sgpa.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoPublicoResumenResponse {

    private long total;
    private long ultimos30Dias;
    private List<ProductoPublicoCategoriaCountResponse> porCategoria;
}
