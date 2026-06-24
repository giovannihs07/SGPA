package com.sgpa.dto.response.reporte;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReporteConteoItemResponse {

    private String key;
    private int count;
    private int publicados;
    private int sinPublicar;
}
