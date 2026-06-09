import {
    tableWrapper, tableHeadRowReporte, tableHeadCellReporte, tableBody, tableRow,
    tableCellPrimary, tableCellMuted,
} from "../../../components/ui/themeTokens";

export const ProduccionDocentesTabla = ({ docentes, loading }) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-sm text-gray-400">
                Cargando ranking…
            </div>
        );
    }

    if (docentes.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-sm text-gray-400 italic">
                No hay docentes con productos en el filtro actual.
            </div>
        );
    }

    return (
        <div className={tableWrapper}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={tableHeadRowReporte}>
                            {["#", "Docente", "Código", "Facultad", "Programa", "Total", "Publicados", "Sin publicar", "Nuevos (30 d)"].map((h) => (
                                <th key={h} className={tableHeadCellReporte}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {docentes.map((d, idx) => (
                            <tr key={d.docenteId ?? idx} className={tableRow}>
                                <td className={`px-4 py-3 ${tableCellMuted} w-10`}>{idx + 1}</td>
                                <td className="px-4 py-3">
                                    <p className={tableCellPrimary}>{d.nombre}</p>
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
                                    {d.codigo}
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} max-w-[140px] truncate`} title={d.facultades}>
                                    {d.facultades}
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} max-w-[160px] truncate`} title={d.programas}>
                                    {d.programas}
                                </td>
                                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                                    {d.total}
                                </td>
                                <td className="px-4 py-3 text-green-600 dark:text-green-400 font-medium">
                                    {d.publicados}
                                </td>
                                <td className="px-4 py-3 text-amber-600 dark:text-amber-400 font-medium">
                                    {d.sinPublicar}
                                </td>
                                <td className="px-4 py-3 text-[#EC7A21] font-medium">
                                    {d.recientes}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
