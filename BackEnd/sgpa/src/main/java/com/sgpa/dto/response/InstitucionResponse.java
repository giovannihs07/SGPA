package com.sgpa.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InstitucionResponse {

    private Long id;
    private String nombre;
    private String nit;
    private String ciudad;
    private String pais;
}
