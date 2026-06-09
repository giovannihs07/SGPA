import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getUsuarios, activarUsuario, desactivarUsuario,
    cambiarRolesUsuario, getRolesDisponibles,
} from "../../services/usuarioService";
import { getDocentes } from "../../services/docenteService";
import { getAdministrativos } from "../../services/administrativoService";
import { getFacultades, getProgramas } from "../../services/institucionService";
import { notifySuccess, notifyError, notifyConfirm } from "../../utils/notify";
import {
    matchFiltroPerfilUsuario,
    matchBusquedaUsuario,
    matchFiltroFacultadUsuario,
    matchFiltroProgramaUsuario,
    matchFiltroDependenciaUsuario,
    perfilRequiereFiltroDocente,
    perfilRequiereFiltroAdministrativo,
    construirMapaDocentesPorPersona,
    construirMapaAdministrativosPorPersona,
    enriquecerUsuariosConPerfil,
    listarDependenciasUnicas,
} from "../../pages/superAdmin/superAdminHelpers";
import { esUsuarioSuperAdmin } from "../../pages/admin/adminHelpers";

export const useUsuariosAdmin = ({ ocultarSuperAdmin = false } = {}) => {
    const [usuariosRaw, setUsuariosRaw]   = useState([]);
    const [rolesDisponibles, setRoles]  = useState([]);
    const [facultades, setFacultades]   = useState([]);
    const [programas, setProgramas]     = useState([]);
    const [dependencias, setDependencias] = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [busqueda, setBusqueda]       = useState("");
    const [filtroEstado, setFiltroEstado] = useState("TODOS");
    const [filtroPerfil, setFiltroPerfil] = useState("TODOS");
    const [filtroFacultad, setFiltroFacultad] = useState("TODAS");
    const [filtroPrograma, setFiltroPrograma] = useState("TODOS");
    const [filtroDependencia, setFiltroDependencia] = useState("TODAS");
    const [usuarioRoles, setUsuarioRoles] = useState(null);
    const [savingRoles, setSavingRoles]   = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [users, roles, docentes, administrativos, facultadesData, programasData] = await Promise.all([
                getUsuarios(),
                getRolesDisponibles(),
                getDocentes(),
                getAdministrativos(),
                getFacultades(),
                getProgramas(),
            ]);
            const mapaDocentes = construirMapaDocentesPorPersona(docentes);
            const mapaAdmin = construirMapaAdministrativosPorPersona(administrativos);

            setUsuariosRaw(enriquecerUsuariosConPerfil(users, mapaDocentes, mapaAdmin));
            setRoles(roles);
            setFacultades(facultadesData);
            setProgramas(programasData);
            setDependencias(listarDependenciasUnicas(administrativos));
        } catch (e) {
            setError(e.response?.data?.error ?? e.message ?? "Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const usuariosFiltrados = useMemo(() =>
        usuariosRaw.filter((u) => {
            if (ocultarSuperAdmin && esUsuarioSuperAdmin(u)) return false;

            const matchBusqueda = matchBusquedaUsuario(u, busqueda);
            const matchEstado = filtroEstado === "TODOS" || u.estado === filtroEstado;
            const matchPerfil = matchFiltroPerfilUsuario(u, filtroPerfil);
            const matchFacultad = !perfilRequiereFiltroDocente(filtroPerfil)
                || matchFiltroFacultadUsuario(u, filtroFacultad);
            const matchPrograma = !perfilRequiereFiltroDocente(filtroPerfil)
                || matchFiltroProgramaUsuario(u, filtroPrograma);
            const matchDependencia = !perfilRequiereFiltroAdministrativo(filtroPerfil)
                || matchFiltroDependenciaUsuario(u, filtroDependencia);

            return matchBusqueda && matchEstado && matchPerfil
                && matchFacultad && matchPrograma && matchDependencia;
        }),
    [usuariosRaw, busqueda, filtroEstado, filtroPerfil, filtroFacultad, filtroPrograma, filtroDependencia, ocultarSuperAdmin]);

    const programasFiltrados = useMemo(() => {
        if (filtroFacultad === "TODAS") return programas;
        return programas.filter((p) => String(p.facultadId) === String(filtroFacultad));
    }, [programas, filtroFacultad]);

    const handleFiltroPerfil = useCallback((v) => {
        setFiltroPerfil(v);
        setFiltroFacultad("TODAS");
        setFiltroPrograma("TODOS");
        setFiltroDependencia("TODAS");
    }, []);

    const handleFiltroFacultad = useCallback((v) => {
        setFiltroFacultad(v);
        setFiltroPrograma("TODOS");
    }, []);

    const actualizarLocal = useCallback((userId, cambios) => {
        setUsuariosRaw((prev) => prev.map((u) => (u.id === userId ? { ...u, ...cambios } : u)));
    }, []);

    const handleActivar = useCallback(async (usuario) => {
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
        filtroPerfil, setFiltroPerfil: handleFiltroPerfil,
        filtroFacultad, setFiltroFacultad: handleFiltroFacultad,
        filtroPrograma, setFiltroPrograma,
        filtroDependencia, setFiltroDependencia,
        facultades, programasFiltrados, dependencias,
        usuarioRoles, setUsuarioRoles,
        rolesDisponibles,
        savingRoles, handleGuardarRoles,
        handleActivar, handleDesactivar,
    };
};
