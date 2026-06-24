import { AlertCircle, RefreshCw, BarChart2, Search, Filter } from "lucide-react";
import { useAdminReportesProduccion } from "../../hooks/admin/useAdminReportesProduccion";
import { SuperAdminKpiGrid } from "../superAdmin/components/SuperAdminKpiGrid";
import { ProduccionTipoTabla } from "./components/ProduccionTipoTabla";
import { ProduccionDocentesTabla } from "./components/ProduccionDocentesTabla";
import { ProduccionRecientesTabla } from "./components/ProduccionRecientesTabla";
import { ReporteExportButtons } from "./components/ReporteExportButtons";
import { PeriodoAutoevaluacionPresets } from "./components/PeriodoAutoevaluacionPresets";
import { CoberturaDocentePanel } from "./components/CoberturaDocentePanel";
import { ProduccionFacultadesTabla } from "./components/ProduccionFacultadesTabla";
import { ProduccionProgramasTabla } from "./components/ProduccionProgramasTabla";
import { ProduccionConteoTabla } from "./components/ProduccionConteoTabla";
import { CoberturaFacultadesChart } from "./components/charts/CoberturaFacultadesChart";
import { ProduccionPorAnioChart } from "./components/charts/ProduccionPorAnioChart";
import { CategoriaDistribucionChart } from "./components/charts/CategoriaDistribucionChart";
import { EstadoDistribucionChart } from "./components/charts/EstadoDistribucionChart";
import { FiltroFechaRango } from "../../components/ui/FiltroFechaRango";
import { FiltroFacultadPrograma } from "../../components/ui/FiltroFacultadPrograma";
import { FiltroTaxonomiaProducto } from "../../components/ui/FiltroTaxonomiaProducto";
import { CATEGORIA_LABELS, SUBCATEGORIA_LABELS, TIPO_LABELS } from "../docente/components/productoHelpers";
import { filterBarAccent, inputXs, inputIcon, focusRing } from "../../components/ui/themeTokens";

export const AdminReportesPage = () => {
    const {
        loading, error, refetch,
        filtros,
        filtroEstado, setFiltroEstado,
        filtroCategoria, setFiltroCategoria,
        filtroSubcategoria, setFiltroSubcategoria,
        filtroTipo, setFiltroTipo,
        filtroFacultad, setFiltroFacultad,
        filtroPrograma, setFiltroPrograma,
        fechaDesde, setFechaDesde,
        fechaHasta, setFechaHasta,
        filtroCampoFecha, setFiltroCampoFecha,
        busquedaBorrador, setBusquedaBorrador, aplicarBusqueda,
        categoriasDisponibles,
        subcategoriasDisponibles,
        tiposDisponibles,
        facultades,
        programasFiltrados,
        resumen,
        kpis,
        porAnio,
        porCategoria,
        porSubcategoria,
        porTipo,
        rankingDocentesTop,
        productosRecientes,
        totalFiltrados,
        cobertura,
        porFacultad,
        porPrograma,
        reporte,
        reporteParams,
        aplicarPresetPeriodo,
        limpiarPeriodo,
        notaAtribucion,
    } = useAdminReportesProduccion();

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
                        Reportes de producción docente
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Indicadores de producción y cobertura docente para autoevaluación y acreditación
                    </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                    <ReporteExportButtons
                        disabled={loading}
                        reporte={reporte}
                        reporteParams={reporteParams}
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

            <div className={`${filterBarAccent} flex-col items-stretch gap-3`}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        aplicarBusqueda();
                    }}
                    className="flex gap-2 w-full"
                >
                    <div className="relative flex-1 min-w-0">
                        <Search size={13} className={inputIcon} aria-hidden="true" />
                        <input
                            type="search"
                            value={busquedaBorrador}
                            onChange={(e) => setBusquedaBorrador(e.target.value)}
                            placeholder="Buscar por producto o docente"
                            aria-label="Buscar en reportes"
                            className={`${inputXs} pl-8 w-full`}
                        />
                    </div>
                    <button
                        type="submit"
                        className={`shrink-0 px-4 py-2 rounded-lg text-xs font-semibold
                            bg-[#EC7A21] text-white hover:bg-[#d96a15] transition ${focusRing}`}
                    >
                        Buscar
                    </button>
                </form>
                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-[#ffc20e]/25 dark:border-[#EC7A21]/25">
                    <Filter size={13} className="text-[#EC7A21] dark:text-[#EFB357] shrink-0" aria-hidden="true" />

                    <div className="flex flex-wrap items-start gap-2">
                        <FiltroFacultadPrograma
                            filtroFacultad={filtroFacultad}
                            onFacultadChange={setFiltroFacultad}
                            filtroPrograma={filtroPrograma}
                            onProgramaChange={setFiltroPrograma}
                            facultades={facultades}
                            programasFiltrados={programasFiltrados}
                        />

                        <FiltroFechaRango
                            fechaDesde={fechaDesde}
                            fechaHasta={fechaHasta}
                            onDesdeChange={setFechaDesde}
                            onHastaChange={setFechaHasta}
                            filtroCampo={filtroCampoFecha}
                            onCampoChange={setFiltroCampoFecha}
                        />
                    </div>

                    <FiltroTaxonomiaProducto
                        filtroEstado={filtroEstado}
                        onEstadoChange={setFiltroEstado}
                        filtroCategoria={filtroCategoria}
                        onCategoriaChange={setFiltroCategoria}
                        filtroSubcategoria={filtroSubcategoria}
                        onSubcategoriaChange={setFiltroSubcategoria}
                        filtroTipo={filtroTipo}
                        onTipoChange={setFiltroTipo}
                        categoriasDisponibles={categoriasDisponibles}
                        subcategoriasDisponibles={subcategoriasDisponibles}
                        tiposDisponibles={tiposDisponibles}
                    />
                </div>
            </div>

            <PeriodoAutoevaluacionPresets
                onAplicar={aplicarPresetPeriodo}
                onLimpiar={limpiarPeriodo}
            />

            <p className="text-xs text-gray-400">
                {loading ? "Calculando reportes…" : `${totalFiltrados} producto${totalFiltrados !== 1 ? "s" : ""} en el reporte`}
            </p>

            <SuperAdminKpiGrid resumen={kpis} loading={loading} />

            <CoberturaDocentePanel cobertura={cobertura} notaAtribucion={notaAtribucion} />

            <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Totales por categoría y subcategoría
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <ProduccionConteoTabla
                        titulo="Por categoría"
                        items={porCategoria}
                        labelFn={(k) => CATEGORIA_LABELS[k] ?? k}
                        loading={loading}
                        totalGeneral={resumen.total}
                        vacio="No hay productos por categoría con los filtros actuales."
                    />
                    <ProduccionConteoTabla
                        titulo="Por subcategoría"
                        items={porSubcategoria}
                        labelFn={(k) => SUBCATEGORIA_LABELS[k] ?? k}
                        loading={loading}
                        totalGeneral={resumen.total}
                        vacio="No hay productos por subcategoría con los filtros actuales."
                    />
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Vista gráfica
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <CoberturaFacultadesChart filas={porFacultad} loading={loading} />
                    <ProduccionPorAnioChart
                        datos={porAnio}
                        loading={loading}
                        campoFecha={filtroCampoFecha}
                    />
                    <EstadoDistribucionChart resumen={resumen} loading={loading} />
                    <CategoriaDistribucionChart
                        items={porCategoria}
                        labelFn={(k) => CATEGORIA_LABELS[k] ?? k}
                        loading={loading}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Indicadores por unidad académica
                </p>
                <ProduccionFacultadesTabla
                    filas={porFacultad}
                    vacio={loading ? "Cargando…" : "No hay facultades en el alcance actual."}
                />
                <ProduccionProgramasTabla
                    filas={porPrograma}
                    vacio={loading ? "Cargando…" : "No hay programas en el alcance actual."}
                />
            </div>

            <ProduccionTipoTabla
                items={porTipo}
                labelFn={(k) => TIPO_LABELS[k] ?? k}
                loading={loading}
                totalGeneral={resumen.total}
                vacio="Sin productos registrados por tipo con los filtros actuales."
            />

            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Top 10 docentes por producción
                    </p>
                    <p className="text-xs text-gray-400">
                        Ranking completo en exportación «Ranking docentes».
                    </p>
                </div>
                <ProduccionDocentesTabla docentes={rankingDocentesTop} loading={loading} />
            </div>

            <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Últimos productos registrados
                    </p>
                    <p className="text-xs text-gray-400">
                        Vista previa (10). Inventario completo en exportación «Inventario productos».
                    </p>
                </div>
                <ProduccionRecientesTabla productos={productosRecientes} loading={loading} />
            </div>
        </div>
    );
};
