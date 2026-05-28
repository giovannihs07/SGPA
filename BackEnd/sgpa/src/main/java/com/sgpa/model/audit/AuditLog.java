package com.sgpa.model.audit;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false)
    private String actorEmail;

    private String actorNombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ModuloAuditoria modulo;

    @Column(nullable = false, length = 60)
    private String accion;

    @Column(nullable = false, length = 500)
    private String descripcion;

    private String entidadTipo;
    private Long entidadId;
    private String entidadLabel;

    @Column(columnDefinition = "TEXT")
    private String detalles;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ResultadoAuditoria resultado;

    private String ipAddress;
}
