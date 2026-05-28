import { AlertCircle, RefreshCw, ScrollText } from "lucide-react";
import { Activity, AlertTriangle, Users, XCircle } from "lucide-react";
import { useSuperAdminAuditoria } from "../../hooks/superadmin/useSuperAdminAuditoria";
import { SuperAdminKpiGrid } from "./components/SuperAdminKpiGrid";
import { AuditoriaFiltros } from "./components/AuditoriaFiltros";
import { AuditoriaTabla } from "./components/AuditoriaTabla";
import { AuditoriaDetalleModal } from "./components/AuditoriaDetalleModal";
import { ProductosPaginacion } from "../docente/components/misProductos/ProductosPaginacion";

const KPI_ICONS = [Activity, AlertTriangle, Users, XCircle];

export const SuperAdminAuditoriaPage = () => {
    const {
        logs, kpis, loading, error, refetch,
        busqueda, setBusqueda,
        filtroModulo, setFiltroModulo,
        filtroResultado, setFiltroResultado,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        pagina, totalPaginas, totalElements, pageSize, irPagina,
        logDetalle, abrirDetalle, cerrarDetalle,
    } = useSuperAdminAuditoria();

    const kpisConIconos = kpis.map((k, i) => ({ ...k, icon: KPI_ICONS[i] ?? Activity }));

    if (loading && logs.length === 0) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
                <RefreshCw size={16} className="animate-spin" /> Cargando logs de auditoría…
            </div>
        );
    }

    if (error && logs.length === 0) {
        return (
            <div className="flex flex-col items-center py-20 gap-3 text-red-500">
                <AlertCircle size={24} />
                <p className="text-sm">{error}</p>
                <button onClick={refetch} className="text-xs text-[#EC7A21] hover:underline">Reintentar</button>
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        Logs de auditoría
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Registro de acciones sensibles en el sistema SGPA
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

            {kpisConIconos.length > 0 && (
                <SuperAdminKpiGrid resumen={kpisConIconos} loading={loading} />
            )}

            <AuditoriaFiltros
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                filtroModulo={filtroModulo}
                setFiltroModulo={setFiltroModulo}
                filtroResultado={filtroResultado}
                setFiltroResultado={setFiltroResultado}
                fechaDesde={fechaDesde}
                setFechaDesde={setFechaDesde}
                fechaHasta={fechaHasta}
                setFechaHasta={setFechaHasta}
                onRefresh={refetch}
            />

            <p className="text-sm text-gray-500 dark:text-gray-400">
                {totalElements} evento{totalElements !== 1 ? "s" : ""}
            </p>

            {logs.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-gray-400">
                    <ScrollText size={32} className="mb-3 opacity-30" />
                    <p className="text-sm font-medium">Sin eventos registrados</p>
                    <p className="text-xs mt-1 opacity-70">Prueba cambiando los filtros</p>
                </div>
            ) : (
                <>
                    <AuditoriaTabla logs={logs} onVerDetalle={abrirDetalle} />
                    <ProductosPaginacion
                        pagina={pagina}
                        totalPaginas={totalPaginas}
                        totalItems={totalElements}
                        pageSize={pageSize}
                        irPagina={irPagina}
                    />
                </>
            )}

            <AuditoriaDetalleModal log={logDetalle} onClose={cerrarDetalle} />
        </div>
    );
};
