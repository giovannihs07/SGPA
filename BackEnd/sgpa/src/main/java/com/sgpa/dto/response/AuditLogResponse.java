package com.sgpa.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {

    private Long id;
    private LocalDateTime fechaCreacion;
    private String actorEmail;
    private String actorNombre;
    private String modulo;
    private String accion;
    private String descripcion;
    private String entidadTipo;
    private Long entidadId;
    private String entidadLabel;
    private String detalles;
    private String resultado;
    private String ipAddress;
}
