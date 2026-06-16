import {
    tableWrapper, tableHeadRowReporte, tableHeadCellReporte, tableBody, tableRow,
    tableCellPrimary, tableCellMuted,
} from "../../../components/ui/themeTokens";

export const ProduccionConteoTabla = ({
    titulo,
    items = [],
    labelFn,
    loading = false,
    totalGeneral = 0,
    vacio = "Sin datos para mostrar",
}) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-sm text-gray-400">
                Cargando {titulo.toLowerCase()}…
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-sm text-gray-400 italic">
                {vacio}
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{titulo}</p>
            </div>
            <div className={tableWrapper}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={tableHeadRowReporte}>
                                <th className={tableHeadCellReporte}>Nombre</th>
                                <th className={`${tableHeadCellReporte} text-right`}>Total productos</th>
                                <th className={`${tableHeadCellReporte} text-right`}>% del total</th>
                            </tr>
                        </thead>
                        <tbody className={tableBody}>
                            {items.map(({ key, count }) => {
                                const pct = totalGeneral > 0
                                    ? Math.round((count / totalGeneral) * 100)
                                    : 0;
                                return (
                                    <tr key={key} className={tableRow}>
                                        <td className={`px-4 py-3 ${tableCellPrimary}`}>
                                            {labelFn(key) ?? key ?? "—"}
                                        </td>
                                        <td className={`px-4 py-3 text-right font-semibold text-gray-900 dark:text-white`}>
                                            {count}
                                        </td>
                                        <td className={`px-4 py-3 text-right ${tableCellMuted}`}>
                                            {pct}%
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
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};
