package com.sgpa.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocenteResponse {

    private Long id;
    private Long personaId;
    private String nombre;
    private String apellido;
    private String cedula;
    private String telefono;
    private String codigoDocente;
    private String tipoContrato;
    private List<TituloAcademicoResponse> titulos;
    private List<ProgramaDocenteDTO> programas;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProgramaDocenteDTO {
        private Long id;
        private String nombre;
        private String codigo;
        private String nivel;
    }
}
