import { AlertCircle, RefreshCw, UserCheck } from "lucide-react";
import { useAprobaciones } from "../../hooks/superadmin/useAprobaciones";
import { AprobacionesTabla } from "../superAdmin/components/AprobacionesTabla";
import { AprobarUsuarioModal } from "../superAdmin/components/AprobarUsuarioModal";
import { ROLES_ASIGNABLES_ADMIN } from "./adminHelpers";

export const AdminAprobacionesPage = () => {
    const {
        pendientes, loading, error, refetch,
        procesando, abrirAprobar, cerrarAprobar, confirmarAprobar,
        usuarioAprobar, rolesDisponibles, savingAprobacion,
        handleRechazar,
    } = useAprobaciones();

    const rolesAsignables = ROLES_ASIGNABLES_ADMIN(rolesDisponibles);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
                <RefreshCw size={16} className="animate-spin" /> Cargando solicitudes…
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
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                    Revisa cada solicitud y confirma los <strong>roles</strong> antes de aprobar.
                    Al rechazar, el usuario no podrá acceder al sistema.
                </p>
            </div>

            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {pendientes.length} solicitud{pendientes.length !== 1 ? "es" : ""} pendiente{pendientes.length !== 1 ? "s" : ""}
                </p>
                <button onClick={refetch}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EC7A21] border border-[#ffc20e]/30 px-3 py-1.5 rounded-lg hover:bg-[#ffc20e]/10">
                    <RefreshCw size={12} /> Actualizar
                </button>
            </div>

            {pendientes.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-gray-400">
                    <UserCheck size={32} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">No hay solicitudes pendientes</p>
                    <p className="text-xs mt-1 opacity-70">Todos los registros están al día.</p>
                </div>
            ) : (
                <AprobacionesTabla
                    pendientes={pendientes}
                    procesando={procesando}
                    onAprobar={abrirAprobar}
                    onRechazar={handleRechazar}
                />
            )}

            <AprobarUsuarioModal
                usuario={usuarioAprobar}
                rolesDisponibles={rolesAsignables}
                onClose={cerrarAprobar}
                onAprobar={confirmarAprobar}
                saving={savingAprobacion}
            />
        </div>
    );
};
