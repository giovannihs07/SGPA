import { ESTADO_USUARIO_CONFIG, ROLE_LABELS, normalizarRoles } from "./superAdminHelpers";

export const agruparUsuariosPorRol = (usuarios) => {
    const counts = {
        ROLE_DOCENTE: 0,
        ROLE_ADMIN: 0,
        ROLE_SUPER_ADMIN: 0,
    };
    for (const u of usuarios ?? []) {
        for (const rol of normalizarRoles(u.roles)) {
            if (counts[rol] !== undefined) counts[rol] += 1;
        }
    }
    return Object.entries(counts)
        .filter(([, count]) => count > 0)
        .map(([key, count]) => ({
            key,
            count,
            label: ROLE_LABELS[key] ?? key,
        }));
};

export const agruparUsuariosPorEstado = (usuarios) =>
    [...(usuarios ?? []).reduce((map, u) => {
        const estado = u.estado ?? "SIN_ESTADO";
        map.set(estado, (map.get(estado) ?? 0) + 1);
        return map;
    }, new Map())].map(([key, count]) => ({
        key,
        count,
        label: ESTADO_USUARIO_CONFIG[key]?.label ?? key,
    }));

export const calcularResumenUsuarios = (usuarios) => ({
    total: usuarios.length,
    activos: usuarios.filter((u) => u.estado === "ACTIVO").length,
    inactivos: usuarios.filter((u) => u.estado === "INACTIVO").length,
    pendientes: usuarios.filter((u) => u.estado === "PENDIENTE").length,
    rechazados: usuarios.filter((u) => u.estado === "RECHAZADO").length,
});

export const filasResumenSistema = ({
    resumenUsuarios,
    resumenProduccion,
    cobertura,
    auditoria,
}) => [
    { Métrica: "Usuarios registrados", Valor: resumenUsuarios.total },
    { Métrica: "Usuarios activos", Valor: resumenUsuarios.activos },
    { Métrica: "Usuarios inactivos", Valor: resumenUsuarios.inactivos },
    { Métrica: "Docentes en sistema", Valor: cobertura.totalDocentes },
    { Métrica: "Docentes con producción", Valor: cobertura.docentesConProduccion },
    { Métrica: "Adopción docente (%)", Valor: cobertura.porcentajeCobertura },
    { Métrica: "Total productos", Valor: resumenProduccion.total },
    { Métrica: "Productos publicados", Valor: resumenProduccion.publicados },
    { Métrica: "Productos sin publicar", Valor: resumenProduccion.sinPublicar },
    { Métrica: "Nuevos (30 días)", Valor: resumenProduccion.recientes },
    { Métrica: "Eventos auditoría (hoy)", Valor: auditoria?.eventosHoy ?? "—" },
    { Métrica: "Críticos auditoría (7 días)", Valor: auditoria?.criticos7Dias ?? "—" },
    { Métrica: "Fallidos auditoría (hoy)", Valor: auditoria?.fallidosHoy ?? "—" },
];
