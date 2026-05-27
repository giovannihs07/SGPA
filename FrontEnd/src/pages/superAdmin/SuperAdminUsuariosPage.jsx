import { AlertCircle, RefreshCw, Users } from "lucide-react";
import { useUsuariosAdmin } from "../../hooks/superadmin/useUsuariosAdmin";
import { UsuariosTabla } from "./components/UsuariosTabla";
import { CambiarRolesModal } from "./components/CambiarRolesModal";
import { AprobarUsuarioModal } from "./components/AprobarUsuarioModal";
import { AdminFiltrosBar } from "./components/ProductosAdminTabla";

const ESTADOS = [
    { value: "TODOS",     label: "Todos los estados" },
    { value: "ACTIVO",    label: "Activos" },
    { value: "PENDIENTE", label: "Pendientes" },
    { value: "INACTIVO",  label: "Inactivos" },
    { value: "RECHAZADO", label: "Rechazados" },
];

export const SuperAdminUsuariosPage = () => {
    const {
        usuarios, loading, error, refetch,
        busqueda, setBusqueda, filtroEstado, setFiltroEstado,
        usuarioRoles, setUsuarioRoles, rolesDisponibles,
        usuarioAprobar, cerrarAprobar, confirmarAprobar, savingAprobacion,
        savingRoles, handleGuardarRoles,
        handleActivar, handleDesactivar, handleRechazar,
    } = useUsuariosAdmin();

    // Si está cargando, se muestra el mensaje de carga
    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
                <RefreshCw size={16} className="animate-spin" /> Cargando usuarios…
            </div>
        );
    }
    // Si hay un error, se muestra el mensaje de error
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
                <p className="text-sm text-gray-500">
                    {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}
                </p>
            </div>
            {/* Filtros de búsqueda y estado */}
            <AdminFiltrosBar
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                estados={ESTADOS}
                placeholder="Buscar por nombre, email o cédula…"
                onRefresh={refetch}
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
                    onRechazar={handleRechazar}
                    onCambiarRoles={setUsuarioRoles}
                />
            )}

            <CambiarRolesModal
                usuario={usuarioRoles}
                rolesDisponibles={rolesDisponibles}
                onClose={() => setUsuarioRoles(null)}
                onGuardar={handleGuardarRoles}
                saving={savingRoles}
            />

            <AprobarUsuarioModal
                usuario={usuarioAprobar}
                rolesDisponibles={rolesDisponibles}
                onClose={cerrarAprobar}
                onAprobar={confirmarAprobar}
                saving={savingAprobacion}
            />
        </div>
    );
};
