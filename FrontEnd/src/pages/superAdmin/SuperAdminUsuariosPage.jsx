import { AlertCircle, RefreshCw, Users } from "lucide-react";
import { useUsuariosAdmin } from "../../hooks/superadmin/useUsuariosAdmin";
import { UsuariosTabla } from "./components/UsuariosTabla";
import { CambiarRolesModal } from "./components/CambiarRolesModal";
import { AdminFiltrosBar } from "./components/ProductosAdminTabla";
import { UsuariosFiltrosContextuales } from "./components/UsuariosFiltrosContextuales";
import { PERFILES_USUARIO_FILTRO } from "./superAdminHelpers";

const ESTADOS = [
    { value: "TODOS",    label: "Todos los estados" },
    { value: "ACTIVO",   label: "Activos" },
    { value: "INACTIVO", label: "Inactivos" },
];

export const SuperAdminUsuariosPage = () => {
    const {
        usuarios, loading, error, refetch,
        busqueda, setBusqueda, filtroEstado, setFiltroEstado,
        filtroPerfil, setFiltroPerfil,
        filtroFacultad, setFiltroFacultad,
        filtroPrograma, setFiltroPrograma,
        filtroDependencia, setFiltroDependencia,
        facultades, programasFiltrados, dependencias,
        usuarioRoles, setUsuarioRoles, rolesDisponibles,
        savingRoles, handleGuardarRoles,
        handleActivar, handleDesactivar,
    } = useUsuariosAdmin();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
                <RefreshCw size={16} className="animate-spin" /> Cargando usuarios…
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center py-20 gap-3 text-red-500">
                <AlertCircle size={24} />
                <p className="text-sm">{error}</p>
                <button onClick={refetch} className="text-xs text-[#EC7A21] hover:underline">Reintentar</button>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}
                </p>
            </div>

            <AdminFiltrosBar
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                filtroPerfil={filtroPerfil}
                setFiltroPerfil={setFiltroPerfil}
                perfiles={PERFILES_USUARIO_FILTRO}
                estados={ESTADOS}
                placeholder="Buscar por nombre o cédula…"
                onRefresh={refetch}
            />

            <UsuariosFiltrosContextuales
                filtroPerfil={filtroPerfil}
                filtroFacultad={filtroFacultad}
                setFiltroFacultad={setFiltroFacultad}
                facultades={facultades}
                filtroPrograma={filtroPrograma}
                setFiltroPrograma={setFiltroPrograma}
                programasFiltrados={programasFiltrados}
                filtroDependencia={filtroDependencia}
                setFiltroDependencia={setFiltroDependencia}
                dependencias={dependencias}
            />

            {usuarios.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-gray-400">
                    <Users size={32} className="mb-3 opacity-30" />
                    <p className="text-sm">Sin resultados</p>
                </div>
            ) : (
                <UsuariosTabla
                    usuarios={usuarios}
                    onActivar={handleActivar}
                    onDesactivar={handleDesactivar}
                    onCambiarRoles={setUsuarioRoles}
                    bloquearSuperAdmin
                />
            )}

            <CambiarRolesModal
                usuario={usuarioRoles}
                rolesDisponibles={rolesDisponibles}
                onClose={() => setUsuarioRoles(null)}
                onGuardar={handleGuardarRoles}
                saving={savingRoles}
            />
        </div>
    );
};
