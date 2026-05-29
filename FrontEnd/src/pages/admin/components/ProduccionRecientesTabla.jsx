import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellMuted, tableCellSubtext,
} from "../../../components/ui/themeTokens";
import { CATEGORIA_LABELS, TIPO_LABELS, formatFecha, truncar } from "../../docente/components/productoHelpers";
import { nombreDocente } from "../adminReportesHelpers";
import { EstadoBadge } from "../../docente/components/misProductos/EstadoBadge";

export const ProduccionRecientesTabla = ({ productos, loading }) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-sm text-gray-400">
                Cargando productos recientes…
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-sm text-gray-400 italic">
                No hay productos recientes con el filtro actual.
            </div>
        );
    }

    return (
        <div className={tableWrapper}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={tableHeadRow}>
                            {["Producto", "Docente", "Facultad", "Programa", "Tipo", "Categoría", "Estado", "Fecha"].map((h) => (
                                <th key={h} className={tableHeadCell}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {productos.map((p) => (
                            <tr key={p.id} className={tableRow}>
                                <td className="px-4 py-3">
                                    <p className={tableCellPrimary}>{truncar(p.nombre, 45)}</p>
                                    {p.descripcion && (
                                        <p className={tableCellSubtext}>{truncar(p.descripcion, 50)}</p>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <p className={tableCellPrimary}>{nombreDocente(p)}</p>
                                    <p className={tableCellSubtext}>{p.docenteCodigo ?? "—"}</p>
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} max-w-[120px] truncate`} title={p.facultadesLabel}>
                                    {p.facultadesLabel ?? "—"}
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} max-w-[140px] truncate`} title={p.programasLabel}>
                                    {p.programasLabel ?? "—"}
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted}`}>
                                    {TIPO_LABELS[p.tipo] ?? p.tipo ?? "—"}
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted}`}>
                                    {CATEGORIA_LABELS[p.categoria] ?? p.categoria ?? "—"}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <EstadoBadge publicado={p.publicado} />
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
                                    {formatFecha(p.fechaCreacion)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
