import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
    card,
    tableWrapper, tableHeadRowReporte, tableHeadCellReporte, tableBody, tableRow,
    tableCellPrimary, tableCellMuted, focusRing,
} from "../../../components/ui/themeTokens";

const totalFila = (item) => item.count ?? item.total ?? 0;

export const ProduccionTipoTabla = ({
    titulo = "Producción por tipo de producto",
    descripcion = "Totales por tipo de productos, con porcentaje respecto al total y desglose publicados / sin publicar.",
    items = [],
    labelFn,
    loading = false,
    totalGeneral = 0,
    vacio = "Sin productos registrados por tipo",
    defaultAbierto = false,
}) => {    const [abierto, setAbierto] = useState(defaultAbierto);

    const contenido = () => {
        if (loading) {
            return (
                <div className="p-8 text-center text-sm text-gray-400">
                    Cargando tipos de producto…
                </div>
            );
        }

        if (items.length === 0) {
            return (
                <div className="p-8 text-center text-sm text-gray-400 italic">
                    {vacio}
                </div>
            );
        }

        const totalPub = items.reduce((acc, item) => acc + (item.publicados ?? 0), 0);
        const totalSinPub = items.reduce((acc, item) => acc + (item.sinPublicar ?? 0), 0);

        return (
            <div className={tableWrapper}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={tableHeadRowReporte}>
                                <th className={tableHeadCellReporte}>Tipo</th>
                                <th className={`${tableHeadCellReporte} text-right`}>Total</th>
                                <th className={`${tableHeadCellReporte} text-right`}>% del total</th>
                                <th className={`${tableHeadCellReporte} text-right`}>Publicados</th>
                                <th className={`${tableHeadCellReporte} text-right`}>Sin publicar</th>
                            </tr>
                        </thead>
                        <tbody className={tableBody}>
                            {items.map((item) => {
                                const total = totalFila(item);
                                const pct = totalGeneral > 0
                                    ? Math.round((total / totalGeneral) * 100)
                                    : 0;
                                return (
                                    <tr key={item.key} className={tableRow}>
                                        <td className={`px-4 py-3 ${tableCellPrimary}`}>
                                            {labelFn(item.key) ?? item.key ?? "—"}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                                            {total}
                                        </td>
                                        <td className={`px-4 py-3 text-right ${tableCellMuted}`}>
                                            {pct}%
                                        </td>
                                        <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
                                            {item.publicados ?? 0}
                                        </td>
                                        <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">
                                            {item.sinPublicar ?? 0}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/40">
                                <td className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                    Total
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-[#EC7A21]">
                                    {totalGeneral}
                                </td>
                                <td className="px-4 py-3 text-right text-gray-500 dark:text-gray-400">
                                    100%
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-green-600 dark:text-green-400">
                                    {totalPub}
                                </td>
                                <td className="px-4 py-3 text-right font-semibold text-amber-600 dark:text-amber-400">
                                    {totalSinPub}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className={`${card} overflow-hidden`}>
            <button
                type="button"
                onClick={() => setAbierto((v) => !v)}
                aria-expanded={abierto}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700
                    text-left hover:bg-gray-50/80 dark:hover:bg-gray-900/30 transition ${focusRing}`}
            >
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {titulo}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {descripcion}
                    </p>
                </div>
                <ChevronDown
                    size={16}
                    className={`shrink-0 text-gray-400 transition-transform ${abierto ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>
            {abierto && contenido()}
        </div>
    );
};