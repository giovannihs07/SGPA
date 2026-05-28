package com.sgpa.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;

import com.sgpa.dto.response.AuditLogPageResponse;
import com.sgpa.dto.response.AuditLogResumenResponse;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;

public interface AuditService {

    void registrar(ModuloAuditoria modulo, String accion, String descripcion,
            String entidadTipo, Long entidadId, String entidadLabel,
            Map<String, Object> detalles, ResultadoAuditoria resultado);

    void registrar(ModuloAuditoria modulo, String accion, String descripcion,
            String entidadTipo, Long entidadId, String entidadLabel,
            Map<String, Object> detalles, ResultadoAuditoria resultado,
            String actorEmail, String ipAddress);

    AuditLogPageResponse listar(String busqueda, String modulo, String accion,
            String resultado, LocalDate desde, LocalDate hasta, Pageable pageable);

    AuditLogResumenResponse obtenerResumen();

    List<String> listarAcciones();
}
