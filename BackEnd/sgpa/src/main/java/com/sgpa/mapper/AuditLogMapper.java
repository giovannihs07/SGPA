package com.sgpa.mapper;

import org.springframework.stereotype.Component;

import com.sgpa.dto.response.AuditLogResponse;
import com.sgpa.model.audit.AuditLog;

@Component
public class AuditLogMapper {

    public AuditLogResponse toDTO(AuditLog log) {
        if (log == null) return null;
        return AuditLogResponse.builder()
            .id(log.getId())
            .fechaCreacion(log.getFechaCreacion())
            .actorEmail(log.getActorEmail())
            .actorNombre(log.getActorNombre())
            .modulo(log.getModulo() != null ? log.getModulo().name() : null)
            .accion(log.getAccion())
            .descripcion(log.getDescripcion())
            .entidadTipo(log.getEntidadTipo())
            .entidadId(log.getEntidadId())
            .entidadLabel(log.getEntidadLabel())
            .detalles(log.getDetalles())
            .resultado(log.getResultado() != null ? log.getResultado().name() : null)
            .ipAddress(log.getIpAddress())
            .build();
    }
}
