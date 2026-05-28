package com.sgpa.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sgpa.model.audit.AuditLog;
import com.sgpa.model.audit.ResultadoAuditoria;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long>,
        JpaSpecificationExecutor<AuditLog> {

    long countByFechaCreacionGreaterThanEqual(LocalDateTime desde);

    long countByResultadoAndFechaCreacionGreaterThanEqual(
            ResultadoAuditoria resultado, LocalDateTime desde);

    @Query("SELECT COUNT(DISTINCT a.actorEmail) FROM AuditLog a WHERE a.fechaCreacion >= :desde")
    long countDistinctActorEmailSince(@Param("desde") LocalDateTime desde);

    @Query("SELECT DISTINCT a.accion FROM AuditLog a ORDER BY a.accion")
    List<String> findDistinctAcciones();
}
