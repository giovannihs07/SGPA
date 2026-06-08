import { AlertCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Users, BookOpen, Settings, ScrollText } from "lucide-react";
import { useSuperAdminDashboard } from "../../hooks/superadmin/useSuperAdminDashboard";
import { SuperAdminKpiGrid } from "./components/SuperAdminKpiGrid";
import { QuickLinkCard } from "./components/QuickLinkCard";

export const DashboardSuperAdminPage = () => {
    const { stats, kpis, loading, error, refetch } = useSuperAdminDashboard();

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
                <AlertCircle size={24} />
                <p className="text-sm">{error}</p>
                <button onClick={refetch} className="text-xs text-[#EC7A21] hover:underline flex items-center gap-1">
                    <RefreshCw size={12} /> Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Panel de Super Admin
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Gestión global del sistema SGPA — Universidad de Cartagena
                    </p>
                </div>
                <button
                    onClick={refetch}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EC7A21]
                        border border-[#ffc20e]/30 px-3 py-1.5 rounded-lg hover:bg-[#ffc20e]/10 transition
                        disabled:opacity-50"
                >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                    Actualizar
                </button>
            </div>

            <SuperAdminKpiGrid resumen={kpis} loading={loading} />

            {!loading && stats?.taxonomiaPendiente && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-800
                    bg-amber-50 dark:bg-amber-900/20 px-4 py-3 flex flex-wrap items-center
                    justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                            Configura la taxonomía de productos
                        </p>
                        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                            Carga la estructura predeterminada (80 tipos) o créala manualmente
                            antes de que los docentes registren producción académica.
                        </p>
                    </div>
                    <Link
                        to="/dashboard/superadmin/configuracion?tab=productos"
                        className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-[#EC7A21]
                            hover:bg-[#d96a15] rounded-lg shrink-0"
                    >
                        Ir a configuración
                    </Link>
                </div>
            )}

            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Accesos rápidos
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <QuickLinkCard
                        to="/dashboard/superadmin/usuarios"
                        icon={Users}
                        title="Gestionar usuarios"
                        description="Consulta usuarios, cambia roles y activa o desactiva cuentas."
                    />
                    <QuickLinkCard
                        to="/dashboard/superadmin/productos"
                        icon={BookOpen}
                        title="Productos publicados"
                        description="Consulta la producción académica que los docentes han publicado."
                    />
                    <QuickLinkCard
                        to="/dashboard/superadmin/configuracion?tab=productos"
                        icon={Settings}
                        title="Configuración del sistema"
                        description="Instituciones, facultades, programas y taxonomía de productos académicos (categorías, tipos y atributos)."
                        badge={stats?.taxonomiaPendiente ? 1 : undefined}
                    />
                    <QuickLinkCard
                        to="/dashboard/superadmin/auditoria"
                        icon={ScrollText}
                        title="Logs de auditoría"
                        description="Consulta quién hizo qué y cuándo en el sistema."
                    />
                </div>
            </div>
        </div>
    );
};
