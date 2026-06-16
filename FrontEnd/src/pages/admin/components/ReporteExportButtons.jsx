import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import {
    getReporteProduccionProductos,
    getReporteProduccionDocentes,
} from "../../../services/reporteService";
import { notifyError, notifyInfo } from "../../../utils/notify";

const grupoTitulo = "px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400";

const itemMenu = (activo) =>
    `w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition
    ${activo
        ? "text-gray-400 cursor-wait"
        : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
    } disabled:opacity-50`;

const iconoExcel = "text-green-600 dark:text-green-400 shrink-0";
const iconoPdf = "text-red-600 dark:text-red-400 shrink-0";

export const ReporteExportButtons = ({ disabled, reporte, reporteParams }) => {
    const [open, setOpen] = useState(false);
    const [exportando, setExportando] = useState(null);
    const ref = useRef(null);

    const puedeEjecutivo = (reporte?.resumen?.total ?? 0) > 0
        || (reporte?.cobertura?.totalDocentes ?? 0) > 0;

    const bloqueado = disabled || exportando !== null;

    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    const cerrar = () => setOpen(false);

    const handleEjecutivoExcel = async () => {
        cerrar();
        try {
            if (!reporte) {
                notifyError("Sin datos", "El reporte aún no está disponible.");
                return;
            }
            if (!puedeEjecutivo) {
                notifyError("Sin datos", "No hay información para exportar con los filtros actuales.");
                return;
            }
            const { exportarReporteEjecutivoExcel } = await import("../../../utils/reporteProduccionExport");
            exportarReporteEjecutivoExcel(reporte);
        } catch (e) {
            notifyError("Error", e.message ?? "No se pudo generar el archivo Excel");
        }
    };

    const handleEjecutivoPdf = async () => {
        cerrar();
        try {
            if (!reporte) {
                notifyError("Sin datos", "El reporte aún no está disponible.");
                return;
            }
            if (!puedeEjecutivo) {
                notifyError("Sin datos", "No hay información para exportar con los filtros actuales.");
                return;
            }
            const { exportarReporteEjecutivoPdf } = await import("../../../utils/reporteProduccionExport");
            exportarReporteEjecutivoPdf(reporte);
        } catch (e) {
            notifyError("Error", e.message ?? "No se pudo generar el PDF");
        }
    };

    const exportarProductos = async (formato) => {
        cerrar();
        setExportando(`productos-${formato}`);
        try {
            const data = await getReporteProduccionProductos(reporteParams);
            if ((data.productos?.length ?? 0) === 0) {
                notifyError("Sin datos", "No hay productos para exportar con los filtros actuales.");
                return;
            }
            if (data.total > 500) {
                notifyInfo(
                    "Exportación grande",
                    `Se exportarán ${data.total} productos. Esto puede tardar unos segundos.`,
                );
            }
            const mod = await import("../../../utils/reporteProduccionExport");
            if (formato === "pdf") {
                mod.exportarReporteProductosPdf(data);
            } else {
                mod.exportarReporteProductosExcel(data);
            }
        } catch (e) {
            notifyError("Error", e.message ?? "No se pudo generar el inventario de productos");
        } finally {
            setExportando(null);
        }
    };

    const exportarDocentes = async (formato) => {
        cerrar();
        setExportando(`docentes-${formato}`);
        try {
            const data = await getReporteProduccionDocentes(reporteParams);
            if ((data.rankingDocentes?.length ?? 0) === 0) {
                notifyError("Sin datos", "No hay docentes con producción para exportar.");
                return;
            }
            if (data.total > 200) {
                notifyInfo(
                    "Exportación grande",
                    `Se exportarán ${data.total} docentes. Esto puede tardar unos segundos.`,
                );
            }
            const mod = await import("../../../utils/reporteProduccionExport");
            if (formato === "pdf") {
                mod.exportarReporteDocentesPdf(data);
            } else {
                mod.exportarReporteDocentesExcel(data);
            }
        } catch (e) {
            notifyError("Error", e.message ?? "No se pudo generar el ranking de docentes");
        } finally {
            setExportando(null);
        }
    };

    const cargandoProductos = exportando?.startsWith("productos");
    const cargandoDocentes = exportando?.startsWith("docentes");

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                disabled={bloqueado}
                aria-expanded={open}
                aria-haspopup="menu"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EC7A21]
                    border border-[#ffc20e]/40 px-3 py-1.5 rounded-lg
                    hover:bg-[#ffc20e]/10 transition disabled:opacity-50"
            >
                {exportando
                    ? <Loader2 size={14} className="animate-spin" />
                    : <Download size={14} />}
                Exportar
                <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 dark:border-gray-600
                        bg-white dark:bg-gray-800 shadow-lg py-1 z-50"
                >
                    <p className={grupoTitulo}>Reporte ejecutivo</p>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleEjecutivoExcel}
                        disabled={bloqueado}
                        className={itemMenu(false)}
                    >
                        <FileSpreadsheet size={15} className={iconoExcel} />
                        Excel
                    </button>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleEjecutivoPdf}
                        disabled={bloqueado}
                        className={itemMenu(false)}
                    >
                        <FileText size={15} className={iconoPdf} />
                        PDF
                    </button>

                    <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

                    <p className={grupoTitulo}>Inventario productos</p>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => exportarProductos("excel")}
                        disabled={bloqueado}
                        className={itemMenu(cargandoProductos)}
                    >
                        {cargandoProductos
                            ? <Loader2 size={15} className="animate-spin shrink-0" />
                            : <FileSpreadsheet size={15} className={iconoExcel} />}
                        Excel — listado completo
                    </button>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => exportarProductos("pdf")}
                        disabled={bloqueado}
                        className={itemMenu(cargandoProductos)}
                    >
                        {cargandoProductos
                            ? <Loader2 size={15} className="animate-spin shrink-0" />
                            : <FileText size={15} className={iconoPdf} />}
                        PDF — listado completo
                    </button>

                    <div className="my-1 border-t border-gray-100 dark:border-gray-700" />

                    <p className={grupoTitulo}>Ranking docentes</p>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => exportarDocentes("excel")}
                        disabled={bloqueado}
                        className={itemMenu(cargandoDocentes)}
                    >
                        {cargandoDocentes
                            ? <Loader2 size={15} className="animate-spin shrink-0" />
                            : <FileSpreadsheet size={15} className={iconoExcel} />}
                        Excel — ranking completo
                    </button>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => exportarDocentes("pdf")}
                        disabled={bloqueado}
                        className={itemMenu(cargandoDocentes)}
                    >
                        {cargandoDocentes
                            ? <Loader2 size={15} className="animate-spin shrink-0" />
                            : <FileText size={15} className={iconoPdf} />}
                        PDF — ranking completo
                    </button>
                </div>
            )}
        </div>
    );
};
