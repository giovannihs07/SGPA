import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getUsuarios, activarUsuario, desactivarUsuario, rechazarUsuario,
    cambiarRolesUsuario, getRolesDisponibles, aprobarUsuario,
} from "../../services/usuarioService";
import { notifySuccess, notifyError, notifyConfirm } from "../../utils/notify";

export const useUsuariosAdmin = () => {
    const [usuarios, setUsuarios]       = useState([]);
    const [rolesDisponibles, setRoles]  = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [busqueda, setBusqueda]       = useState("");
    const [filtroEstado, setFiltroEstado] = useState("TODOS");
    const [usuarioRoles, setUsuarioRoles] = useState(null);
    const [usuarioAprobar, setUsuarioAprobar] = useState(null);
    const [savingRoles, setSavingRoles]   = useState(false);
    const [savingAprobacion, setSavingAprobacion] = useState(false);

    // Función para obtener los usuarios y los roles disponibles del backend
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [users, roles] = await Promise.all([getUsuarios(), getRolesDisponibles()]);
            setUsuarios(users);
            setRoles(roles);
        } catch (e) {
            setError(e.response?.data?.error ?? e.message ?? "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Función para filtrar los usuarios por el estado y la búsqueda
    const usuariosFiltrados = useMemo(() =>
        usuarios.filter((u) => {
            const q = busqueda.toLowerCase();
            const matchBusqueda = !q
                || u.email?.toLowerCase().includes(q)
                || u.nombre?.toLowerCase().includes(q)
                || u.apellido?.toLowerCase().includes(q)
                || u.cedula?.includes(q);
            const matchEstado = filtroEstado === "TODOS" || u.estado === filtroEstado;
            return matchBusqueda && matchEstado;
        }),
    [usuarios, busqueda, filtroEstado]);

    // Función para actualizar los usuarios en el estado local
    const actualizarLocal = useCallback((userId, cambios) => {
        setUsuarios((prev) => prev.map((u) => (u.id === userId ? { ...u, ...cambios } : u)));
    }, []);

    // Función para activar el usuario
    const handleActivar = useCallback(async (usuario) => {
        if (usuario.estado === "PENDIENTE") {
            setUsuarioAprobar(usuario);
            return;
        }
        const ok = await notifyConfirm("Activar usuario", `¿Activar a ${usuario.email}?`);
        if (!ok) return;
        try {
            await activarUsuario(usuario.id);
            actualizarLocal(usuario.id, { estado: "ACTIVO" });
            notifySuccess("Usuario activado", `${usuario.email} fue activado.`);
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? "No se pudo activar el usuario");
        }
    }, [actualizarLocal]);

    const cerrarAprobar = useCallback(() => setUsuarioAprobar(null), []);

    const confirmarAprobar = useCallback(async (userId, roles) => {
        setSavingAprobacion(true);
        try {
            await aprobarUsuario(userId, roles);
            actualizarLocal(userId, { estado: "ACTIVO", roles });
            setUsuarioAprobar(null);
            notifySuccess("Registro aprobado", "El usuario fue activado con los roles asignados.");
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? "No se pudo aprobar el registro");
        } finally {
            setSavingAprobacion(false);
        }
    }, [actualizarLocal]);

    // Función para rechazar el usuario
    const handleRechazar = useCallback(async (usuario) => {
        if (usuario.estado !== "PENDIENTE") {
            return notifyError("Error", "Solo se pueden rechazar usuarios pendientes.");
        }
        const ok = await notifyConfirm(
            "Rechazar registro",
            `¿Rechazar el registro de ${usuario.email}?`,
        );
        if (!ok) return;
        try {
            await rechazarUsuario(usuario.id);
            actualizarLocal(usuario.id, { estado: "RECHAZADO" });
            notifySuccess("Registro rechazado", `El registro de ${usuario.email} fue rechazado.`);
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? "No se pudo rechazar el registro");
        }
    }, [actualizarLocal]);

    // Función para desactivar el usuario
    const handleDesactivar = useCallback(async (usuario) => {
        const ok = await notifyConfirm("Desactivar usuario", `¿Desactivar a ${usuario.email}?`);
        if (!ok) return;
        try {
            await desactivarUsuario(usuario.id);
            actualizarLocal(usuario.id, { estado: "INACTIVO" });
            notifySuccess("Usuario desactivado", `${usuario.email} fue desactivado.`);
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? "No se pudo desactivar el usuario");
        }
    }, [actualizarLocal]);

    // Función para guardar los roles del usuario
    const handleGuardarRoles = useCallback(async (roles) => {
        if (!usuarioRoles) return;
        setSavingRoles(true);
        try {
            await cambiarRolesUsuario(usuarioRoles.id, roles);
            actualizarLocal(usuarioRoles.id, { roles });
            setUsuarioRoles(null);
            notifySuccess("Roles actualizados", "Los roles del usuario fueron actualizados.");
            await fetchData();
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? "No se pudieron cambiar los roles");
        } finally {
            setSavingRoles(false);
        }
    }, [usuarioRoles, actualizarLocal, fetchData]);

    return {
        usuarios: usuariosFiltrados,
        loading, error, refetch: fetchData,
        busqueda, setBusqueda,
        filtroEstado, setFiltroEstado,
        usuarioRoles, setUsuarioRoles,
        usuarioAprobar, cerrarAprobar, confirmarAprobar, savingAprobacion,
        rolesDisponibles,
        savingRoles, handleGuardarRoles,
        handleActivar, handleDesactivar, handleRechazar,
    };
};
