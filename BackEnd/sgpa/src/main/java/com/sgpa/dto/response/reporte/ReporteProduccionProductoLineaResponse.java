package com.sgpa.dto.response.reporte;

import java.time.LocalDate;
import java.util.List;

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
public class ReporteProduccionProductoLineaResponse {

    private Long id;
    private String nombre;
    private String descripcion;

    private Long docenteId;
    private String docenteNombre;
    private String docenteApellido;
    private String docenteCodigo;

    private List<Long> facultadIds;
    private List<String> facultadNombres;
    private List<Long> programaIds;
    private List<String> programaNombres;
    private String facultadesLabel;
    private String programasLabel;

    private String categoria;
    private String subcategoria;
    private String tipo;

    private Boolean publicado;
    private LocalDate fechaRegistroSgpa;
    private LocalDate fechaPublicacionSgpa;
}
