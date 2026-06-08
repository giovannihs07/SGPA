import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellMuted,
} from "../../../../components/ui/themeTokens";
import {
    CATEGORIA_LABELS, SUBCATEGORIA_LABELS, TIPO_LABELS,
    formatFecha, truncar,
} from "../productoHelpers";
import { EstadoBadge } from "../misProductos/EstadoBadge";

export const DocenteMisProductosTabla = ({ productos, loading }) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-sm text-gray-400">
                Cargando productos…
            </div>
        );
    }

    if (productos.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-sm text-gray-400 italic">
                No hay productos con los filtros actuales.
            </div>
        );
    }

    return (
        <div className={tableWrapper}>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={tableHeadRow}>
                            {["Producto", "Categoría", "Subcategoría", "Tipo", "Estado", "Registro SGPA", "Publicado en SGPA"].map((h) => (
                                <th key={h} className={tableHeadCell}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {productos.map((p) => (
                            <tr key={p.id} className={tableRow}>
                                <td className="px-4 py-3 max-w-55">
                                    <p className={`${tableCellPrimary} line-clamp-2`}>
                                        {truncar(p.nombre, 55)}
                                    </p>
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
                                    {CATEGORIA_LABELS[p.categoria] ?? p.categoria ?? "—"}
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} max-w-37.5`}>
                                    <span className="line-clamp-2">
                                        {SUBCATEGORIA_LABELS[p.subcategoria] ?? p.subcategoria ?? "—"}
                                    </span>
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} max-w-37.5`}>
                                    <span className="line-clamp-2">
                                        {TIPO_LABELS[p.tipo] ?? p.tipo ?? "—"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <EstadoBadge publicado={p.publicado} />
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
                                    {formatFecha(p.fechaRegistroSgpa)}
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
                                    {formatFecha(p.fechaPublicacionSgpa)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
