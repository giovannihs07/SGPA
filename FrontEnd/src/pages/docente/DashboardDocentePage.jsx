import { Link } from "react-router-dom";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useDocenteDashboard } from "../../hooks/useDocenteDashboard";
import { MisProductosKpiGrid } from "./components/misProductos/MisProductosKpiGrid";
import {
    DocenteProductosRecientes,
    DocenteDistribucionCategorias,
} from "./components/dashboard/DocenteProductosRecientes";

export const DashboardDocentePage = () => {
    const {
        nombreDocente,
        resumen,
        recientes,
        porCategoria,
        loading,
        error,
        refetch,
    } = useDocenteDashboard();

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
                <AlertCircle size={24} />
                <p className="text-sm">{error}</p>
                <button
                    onClick={refetch}
                    className="text-xs text-[#EC7A21] hover:underline flex items-center gap-1"
                >
                    <RefreshCw size={12} /> Reintentar
                </button>
            </div>
        );
    }

    const saludo = nombreDocente
        ? `Bienvenido/a, ${nombreDocente}`
        : "Bienvenido/a";

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {saludo}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Resumen de tu producción académica en SGPA
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

            <MisProductosKpiGrid resumen={resumen} />

            {!loading && resumen.total === 0 && (
                <div className="rounded-xl border border-amber-200 dark:border-amber-800
                    bg-amber-50 dark:bg-amber-900/20 px-4 py-4 flex flex-wrap items-center
                    justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                            Aún no has registrado producción académica
                        </p>
                        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                            Comienza registrando tu primer producto en SGPA.
                        </p>
                    </div>
                    <Link
                        to="/dashboard/docente/registrar"
                        className="inline-flex px-4 py-2 text-sm font-semibold text-white bg-[#EC7A21]
                            hover:bg-[#d96a15] rounded-lg shrink-0"
                    >
                        Registrar producto
                    </Link>
                </div>
            )}

            {!loading && resumen.total > 0 && resumen.sinPublicar > 0 && (
                <div className="rounded-xl border border-blue-200 dark:border-blue-800
                    bg-blue-50 dark:bg-blue-900/20 px-4 py-4 flex flex-wrap items-center
                    justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                            Tienes {resumen.sinPublicar} producto{resumen.sinPublicar !== 1 ? "s" : ""} sin publicar en SGPA
                        </p>
                        <p className="text-xs text-blue-800/80 dark:text-blue-300/80 mt-0.5">
                            Publícalos desde Mis productos cuando estén listos para compartirse.
                        </p>
                    </div>
                    <Link
                        to="/dashboard/docente/productos"
                        className="inline-flex px-4 py-2 text-sm font-semibold text-[#EC7A21]
                            border border-[#ffc20e]/40 bg-white dark:bg-gray-800
                            hover:bg-[#ffc20e]/10 rounded-lg shrink-0"
                    >
                        Ir a Mis productos
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                    <DocenteProductosRecientes productos={recientes} loading={loading} />
                </div>
                <div>
                    <DocenteDistribucionCategorias
                        items={porCategoria}
                        loading={loading}
                        total={resumen.total}
                    />
                </div>
            </div>
        </div>
    );
};
