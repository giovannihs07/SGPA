import { useState, useEffect, useCallback } from "react";
import {
    getUsuariosPendientes, aprobarUsuario, rechazarUsuario, getRolesDisponibles,
} from "../../services/usuarioService";
import { notifySuccess, notifyError, notifyConfirm } from "../../utils/notify";
import { normalizarRoles } from "../../pages/superAdmin/superAdminHelpers";

export const useAprobaciones = () => {
    const [pendientes, setPendientes]       = useState([]);
    const [rolesDisponibles, setRoles]      = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);
    const [procesando, setProcesando]       = useState(null);
    const [usuarioAprobar, setUsuarioAprobar] = useState(null);
    const [savingAprobacion, setSavingAprobacion] = useState(false);

    const fetchPendientes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [users, roles] = await Promise.all([
                getUsuariosPendientes(),
                getRolesDisponibles(),
            ]);
            setPendientes(users);
            setRoles(roles);
        } catch (e) {
            setError(e.response?.data?.error ?? e.message ?? "Error al cargar pendientes");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchPendientes(); }, [fetchPendientes]);

    const abrirAprobar = useCallback((usuario) => {
        setUsuarioAprobar(usuario);
    }, []);

    const cerrarAprobar = useCallback(() => {
        setUsuarioAprobar(null);
    }, []);

    const confirmarAprobar = useCallback(async (userId, roles) => {
        setSavingAprobacion(true);
        try {
            await aprobarUsuario(userId, roles);
            setPendientes((prev) => prev.filter((u) => (u.userId ?? u.id) !== userId));
            setUsuarioAprobar(null);
            notifySuccess("Registro aprobado", "El usuario fue activado con los roles asignados.");
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? "No se pudo aprobar el registro");
        } finally {
            setSavingAprobacion(false);
        }
    }, []);

    const handleRechazar = useCallback(async (usuario) => {
        const userId = usuario.userId ?? usuario.id;
        const rolesTexto = normalizarRoles(usuario.roles)
            .map((r) => r.replace("ROLE_", ""))
            .join(", ");

        const ok = await notifyConfirm(
            "Rechazar registro",
            `¿Rechazar el registro de ${usuario.email}?` +
            (rolesTexto ? ` Roles solicitados: ${rolesTexto}.` : "") +
            " Esta acción no se puede deshacer.",
        );
        if (!ok) return;

        setProcesando(userId);
        try {
            await rechazarUsuario(userId);
            setPendientes((prev) => prev.filter((u) => (u.userId ?? u.id) !== userId));
            notifySuccess("Registro rechazado", `El registro de ${usuario.email} fue rechazado.`);
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? "No se pudo rechazar el registro");
        } finally {
            setProcesando(null);
        }
    }, []);

    return {
        pendientes, loading, error, refetch: fetchPendientes,
        procesando, abrirAprobar, cerrarAprobar, confirmarAprobar,
        usuarioAprobar, rolesDisponibles, savingAprobacion,
        handleRechazar,
    };
};
