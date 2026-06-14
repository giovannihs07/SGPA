package com.sgpa.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sgpa.dto.response.AuditLogPageResponse;
import com.sgpa.dto.response.AuditLogResumenResponse;
import com.sgpa.dto.response.AuditLogResponse;
import com.sgpa.mapper.AuditLogMapper;
import com.sgpa.model.audit.AuditLog;
import com.sgpa.model.audit.ModuloAuditoria;
import com.sgpa.model.audit.ResultadoAuditoria;
import com.sgpa.repository.AuditLogRepository;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository repository;
    private final AuditLogMapper mapper;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void registrar(ModuloAuditoria modulo, String accion, String descripcion,
            String entidadTipo, Long entidadId, String entidadLabel,
            Map<String, Object> detalles, ResultadoAuditoria resultado) {
        registrar(modulo, accion, descripcion, entidadTipo, entidadId, entidadLabel,
                detalles, resultado, obtenerActorEmail(), null);
    }

    @Override
    @Transactional
    public void registrar(ModuloAuditoria modulo, String accion, String descripcion,
            String entidadTipo, Long entidadId, String entidadLabel,
            Map<String, Object> detalles, ResultadoAuditoria resultado,
            String actorEmail, String ipAddress) {

        AuditLog log = AuditLog.builder()
            .actorEmail(actorEmail != null ? actorEmail : "SISTEMA")
            .modulo(modulo)
            .accion(accion)
            .descripcion(descripcion)
            .entidadTipo(entidadTipo)
            .entidadId(entidadId)
            .entidadLabel(entidadLabel)
            .detalles(serializarDetalles(detalles))
            .resultado(resultado != null ? resultado : ResultadoAuditoria.EXITOSO)
            .ipAddress(ipAddress)
            .build();

        repository.save(log);
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public AuditLogPageResponse listar(String busqueda, String modulo, String accion,
            String resultado, LocalDate desde, LocalDate hasta, Pageable pageable) {

        Specification<AuditLog> spec = construirSpec(
                busqueda, modulo, accion, resultado, desde, hasta);

        Page<AuditLog> page = repository.findAll(spec, pageable);
        List<AuditLogResponse> content = page.getContent().stream()
            .map(mapper::toDTO)
            .toList();

        return AuditLogPageResponse.builder()
            .content(content)
            .page(page.getNumber())
            .size(page.getSize())
            .totalElements(page.getTotalElements())
            .totalPages(page.getTotalPages())
            .build();
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public AuditLogResumenResponse obtenerResumen() {
        LocalDateTime inicioHoy = LocalDate.now().atStartOfDay();
        LocalDateTime hace7Dias = LocalDateTime.now().minusDays(7);

        return AuditLogResumenResponse.builder()
            .eventosHoy(repository.countByFechaCreacionGreaterThanEqual(inicioHoy))
            .criticos7Dias(repository.countByResultadoAndFechaCreacionGreaterThanEqual(
                    ResultadoAuditoria.CRITICO, hace7Dias))
            .usuariosUnicos7Dias(repository.countDistinctActorEmailSince(hace7Dias))
            .fallidosHoy(repository.countByResultadoAndFechaCreacionGreaterThanEqual(
                    ResultadoAuditoria.FALLIDO, inicioHoy))
            .build();
    }

    @Override
    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public List<String> listarAcciones() {
        return repository.findDistinctAcciones();
    }

    private Specification<AuditLog> construirSpec(String busqueda, String modulo,
            String accion, String resultado, LocalDate desde, LocalDate hasta) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (busqueda != null && !busqueda.isBlank()) {
                String term = "%" + busqueda.toLowerCase().trim() + "%";
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get("actorEmail")), term),
                    cb.like(cb.lower(root.get("actorNombre")), term),
                    cb.like(cb.lower(root.get("descripcion")), term),
                    cb.like(cb.lower(root.get("entidadLabel")), term),
                    cb.like(cb.lower(root.get("accion")), term)
                ));
            }

            if (modulo != null && !modulo.isBlank() && !"TODOS".equalsIgnoreCase(modulo)) {
                predicates.add(cb.equal(root.get("modulo"),
                        ModuloAuditoria.valueOf(modulo)));
            }

            if (accion != null && !accion.isBlank() && !"TODAS".equalsIgnoreCase(accion)) {
                predicates.add(cb.equal(root.get("accion"), accion));
            }

            if (resultado != null && !resultado.isBlank() && !"TODOS".equalsIgnoreCase(resultado)) {
                predicates.add(cb.equal(root.get("resultado"),
                        ResultadoAuditoria.valueOf(resultado)));
            }

            if (desde != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        root.get("fechaCreacion"), desde.atStartOfDay()));
            }

            if (hasta != null) {
                predicates.add(cb.lessThanOrEqualTo(
                        root.get("fechaCreacion"), hasta.atTime(LocalTime.MAX)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private String serializarDetalles(Map<String, Object> detalles) {
        if (detalles == null || detalles.isEmpty()) return null;
        try {
            return objectMapper.writeValueAsString(detalles);
        } catch (JsonProcessingException e) {
            return detalles.toString();
        }
    }

    private String obtenerActorEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            return "SISTEMA";
        }
        return auth.getName();
    }
}
