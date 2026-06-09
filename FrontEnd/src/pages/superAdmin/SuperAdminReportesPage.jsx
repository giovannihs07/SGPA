import { Link } from "react-router-dom";
import { AlertCircle, BarChart2, RefreshCw } from "lucide-react";
import { useSuperAdminReportes } from "../../hooks/superadmin/useSuperAdminReportes";
import { SuperAdminKpiGrid } from "./components/SuperAdminKpiGrid";
import { CoberturaDocentePanel } from "../admin/components/CoberturaDocentePanel";
import { ProduccionPorAnioChart } from "../admin/components/charts/ProduccionPorAnioChart";
import { EstadoDistribucionChart } from "../admin/components/charts/EstadoDistribucionChart";
import { CategoriaDistribucionChart } from "../admin/components/charts/CategoriaDistribucionChart";
import { CATEGORIA_LABELS } from "../docente/components/productoHelpers";
import { UsuariosPorRolChart } from "./components/reportes/UsuariosPorRolChart";
import { UsuariosPorEstadoChart } from "./components/reportes/UsuariosPorEstadoChart";
import { AuditoriaResumenPanel } from "./components/reportes/AuditoriaResumenPanel";
import { SuperAdminReporteExportButtons } from "./components/reportes/SuperAdminReporteExportButtons";

export const SuperAdminReportesPage = () => {
    const {
        loading,
        error,
        refetch,
        resumenUsuarios,
        resumenProduccion,
        cobertura,
        porAnio,
        porCategoria,
        usuariosPorRol,
        usuariosPorEstado,
        auditoria,
        auditoriaKpis,
        kpis,
        notaAtribucion,
        taxonomiaPendiente,
    } = useSuperAdminReportes();

    const exportPayload = {
        resumenUsuarios,
        resumenProduccion,
        cobertura,
        auditoria,
        usuariosPorRol,
        usuariosPorEstado,
    };

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
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart2 size={20} className="text-[#EC7A21]" />
                        Reportes del sistema
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Adopción, producción global y auditoría del SGPA
                    </p>
                </div>
                <div className="flex flex-col items-stretch sm:items-end gap-2">
                    <SuperAdminReporteExportButtons disabled={loading} payload={exportPayload} />
                    <button
                        onClick={refetch}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#EC7A21]
                            border border-[#ffc20e]/30 px-3 py-1.5 rounded-lg hover:bg-[#ffc20e]/10 transition
                            disabled:opacity-50"
                    >
                        <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                        Actualizar
                    </button>
                </div>
            </div>

            {taxonomiaPendiente && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-800
                    bg-amber-50 dark:bg-amber-900/20 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                        La taxonomía de productos aún no está configurada.
                    </p>
                    <Link
                        to="/dashboard/superadmin/configuracion?tab=productos"
                        className="text-xs font-semibold text-[#EC7A21] hover:underline shrink-0"
                    >
                        Configurar taxonomía →
                    </Link>
                </div>
            )}

            <SuperAdminKpiGrid resumen={kpis} loading={loading} />

            <CoberturaDocentePanel cobertura={cobertura} notaAtribucion={notaAtribucion} />

            <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Producción global
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <ProduccionPorAnioChart datos={porAnio} loading={loading} compact />
                    <EstadoDistribucionChart resumen={resumenProduccion} loading={loading} compact />
                    <CategoriaDistribucionChart
                        items={porCategoria}
                        labelFn={(k) => CATEGORIA_LABELS[k] ?? k}
                        loading={loading}
                        compact
                    />
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Usuarios del sistema
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <UsuariosPorRolChart items={usuariosPorRol} loading={loading} compact />
                    <UsuariosPorEstadoChart items={usuariosPorEstado} loading={loading} compact />
                </div>
            </div>

            <AuditoriaResumenPanel kpis={auditoriaKpis} loading={loading} />
        </div>
    );
};
