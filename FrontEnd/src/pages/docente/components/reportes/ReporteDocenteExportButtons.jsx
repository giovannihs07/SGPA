import { FileSpreadsheet, FileText } from "lucide-react";
import { notifyError } from "../../../../utils/notify";

export const ReporteDocenteExportButtons = ({
    disabled,
    productosFiltrados,
    resumen,
    docente,
    filtros,
    porCategoria,
    porSubcategoria,
}) => {
    const payload = {
        productos: productosFiltrados,
        resumen,
        docente,
        filtros,
        porCategoria,
        porSubcategoria,
    };

    const handleExcel = async () => {
        try {
            if (productosFiltrados.length === 0) {
                notifyError("Sin datos", "No hay productos para exportar con los filtros actuales.");
                return;
            }
            const { exportarMiReporteExcel } = await import("../../../../utils/reporteProduccionDocenteExport");
            exportarMiReporteExcel(payload);
        } catch (e) {
            notifyError("Error", e.message ?? "No se pudo generar el archivo Excel");
        }
    };

    const handlePdf = async () => {
        try {
            if (productosFiltrados.length === 0) {
                notifyError("Sin datos", "No hay productos para exportar con los filtros actuales.");
                return;
            }
            const { exportarMiReportePdf } = await import("../../../../utils/reporteProduccionDocenteExport");
            exportarMiReportePdf(payload);
        } catch (e) {
            notifyError("Error", e.message ?? "No se pudo generar el PDF");
        }
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <button
                type="button"
                onClick={handleExcel}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400
                    border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-lg
                    hover:bg-green-50 dark:hover:bg-green-900/20 transition disabled:opacity-50"
            >
                <FileSpreadsheet size={14} />
                Exportar Excel
            </button>
            <button
                type="button"
                onClick={handlePdf}
                disabled={disabled}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 dark:text-red-400
                    border border-red-200 dark:border-red-800 px-3 py-1.5 rounded-lg
                    hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
            >
                <FileText size={14} />
                Exportar PDF
            </button>
        </div>
    );
};
