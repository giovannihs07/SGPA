import { AlertCircle, RefreshCw, BarChart2, Search, Filter } from "lucide-react";
import { useDocenteReportes } from "../../hooks/useDocenteReportes";
import { SuperAdminKpiGrid } from "../superAdmin/components/SuperAdminKpiGrid";
import { ProduccionBarrasPanel } from "../admin/components/ProduccionBarrasPanel";
import { ReporteDocenteExportButtons } from "./components/reportes/ReporteDocenteExportButtons";
import { DocenteMisProductosTabla } from "./components/reportes/DocenteMisProductosTabla";
import { FiltroFechaRango } from "../../components/ui/FiltroFechaRango";
import { CATEGORIA_LABELS, SUBCATEGORIA_LABELS, TIPO_LABELS } from "./components/productoHelpers";
import { SelectFilter } from "./components/misProductos/SelectFilter";
import { filterBar, inputXs, inputIcon } from "../../components/ui/themeTokens";
import { nombreDocentePerfil } from "./docenteReportesHelpers";

export const ReportesDocentePage = () => {
    const {
        docente,
        loading, error, refetch,
        filtros,
        filtroEstado, setFiltroEstado,
        filtroCategoria, setFiltroCategoria,
        filtroSubcategoria, setFiltroSubcategoria,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        filtroCampoFecha, setFiltroCampoFecha,
        busqueda, setBusqueda,
        categoriasDisponibles,
        subcategoriasDisponibles,
        resumen,
        kpis,
        porCategoria,
        porSubcategoria,
        porTipo,
        productosFiltrados,
        totalFiltrados,
    } = useDocenteReportes();

    if (error) {
        return (
            <div className="flex flex-col items-center py-20 gap-3 text-red-500">
                <AlertCircle size={24} />
                <p className="text-sm">{error}</p>
                <button onClick={refetch} className="text-xs text-[#EC7A21] hover:underline">Reintentar</button>
            </div>
        );
    }

    const nombre = nombreDocentePerfil(docente);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart2 size={20} className="text-[#EC7A21]" />
                        Mis reportes de producción
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {nombre !== "—"
                            ? `Análisis de la producción académica de ${nombre} en SGPA`
                            : "Análisis de tu producción académica registrada en SGPA"}
                    </p>
                </div>
                <div className="flex flex-col items-stretch sm:items-end gap-2">
                    <ReporteDocenteExportButtons
                        disabled={loading}
                        productosFiltrados={productosFiltrados}
                        resumen={resumen}
                        docente={docente}
                        filtros={filtros}
                    />
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

            <div className={filterBar}>
                <div className="relative flex-1 min-w-45">
                    <Search size={13} className={inputIcon} aria-hidden="true" />
                    <input
                        type="search"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre o descripción…"
                        aria-label="Buscar en mis reportes"
                        className={`${inputXs} pl-8`}
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter size={13} className="text-gray-500 dark:text-gray-400 shrink-0" aria-hidden="true" />

                    <SelectFilter value={filtroEstado} onChange={setFiltroEstado} aria-label="Filtrar por estado">
                        <option value="TODOS">Todos los estados</option>
                        <option value="PUBLICADO">Solo publicados</option>
                        <option value="SIN_PUBLICAR">Sin publicar</option>
                    </SelectFilter>

                    <SelectFilter value={filtroCategoria} onChange={setFiltroCategoria} aria-label="Filtrar por categoría">
                        {categoriasDisponibles.map((c) => (
                            <option key={c} value={c}>
                                {c === "TODAS" ? "Todas las categorías" : (CATEGORIA_LABELS[c] ?? c)}
                            </option>
                        ))}
                    </SelectFilter>

                    <SelectFilter value={filtroSubcategoria} onChange={setFiltroSubcategoria} aria-label="Filtrar por subcategoría">
                        {subcategoriasDisponibles.map((s) => (
                            <option key={s} value={s}>
                                {s === "TODAS" ? "Todas las subcategorías" : (SUBCATEGORIA_LABELS[s] ?? s)}
                            </option>
                        ))}
                    </SelectFilter>
                </div>
            </div>

            <FiltroFechaRango
                fechaDesde={fechaDesde}
                fechaHasta={fechaHasta}
                onDesdeChange={setFechaDesde}
                onHastaChange={setFechaHasta}
                filtroCampo={filtroCampoFecha}
                onCampoChange={setFiltroCampoFecha}
            />

            <p className="text-xs text-gray-400">
                {loading ? "Calculando reportes…" : `${totalFiltrados} producto${totalFiltrados !== 1 ? "s" : ""} en el reporte`}
            </p>

            <SuperAdminKpiGrid resumen={kpis} loading={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ProduccionBarrasPanel
                    titulo="Por categoría"
                    items={porCategoria}
                    labelFn={(k) => CATEGORIA_LABELS[k] ?? k}
                    loading={loading}
                />
                <ProduccionBarrasPanel
                    titulo="Por subcategoría"
                    items={porSubcategoria}
                    labelFn={(k) => SUBCATEGORIA_LABELS[k] ?? k}
                    loading={loading}
                    maxItems={10}
                />
            </div>

            <ProduccionBarrasPanel
                titulo="Por tipo"
                items={porTipo}
                labelFn={(k) => TIPO_LABELS[k] ?? k}
                loading={loading}
                maxItems={porTipo.length || 1}
                emptyMessage="Sin productos registrados por tipo"
            />

            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Detalle de mis productos
                </p>
                <DocenteMisProductosTabla productos={productosFiltrados} loading={loading} />
            </div>
        </div>
    );
};
