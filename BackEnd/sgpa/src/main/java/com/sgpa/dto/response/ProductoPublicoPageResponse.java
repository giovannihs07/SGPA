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
public class ProductoPublicoPageResponse {

    private List<ProductoDocenteResponse> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private long ultimos30Dias;
}
