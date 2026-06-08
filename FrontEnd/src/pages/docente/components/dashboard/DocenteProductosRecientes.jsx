import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellMuted,
} from "../../../../components/ui/themeTokens";
import { CATEGORIA_LABELS, TIPO_LABELS, formatFecha, truncar } from "../productoHelpers";
import { EstadoBadge } from "../misProductos/EstadoBadge";

export const DocenteProductosRecientes = ({ productos, loading }) => (
    <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                Actividad reciente
            </h3>
            {productos.length > 0 && (
                <Link
                    to="/dashboard/docente/productos"
                    className="text-xs font-semibold text-[#EC7A21] hover:underline"
                >
                    Ver todos
                </Link>
            )}
        </div>

        {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-sm text-gray-400">
                Cargando productos…
            </div>
        ) : productos.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 text-center text-sm text-gray-400">
                Aún no tienes productos registrados.
            </div>
        ) : (
            <div className={tableWrapper}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={tableHeadRow}>
                                {["Producto", "Categoría", "Tipo", "Estado", "Registro SGPA"].map((h) => (
                                    <th key={h} className={tableHeadCell}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={tableBody}>
                            {productos.map((p) => (
                                <tr key={p.id} className={tableRow}>
                                    <td className="px-4 py-3 max-w-55">
                                        <p className={`${tableCellPrimary} line-clamp-2`}>
                                            {truncar(p.nombre, 50)}
                                        </p>
                                    </td>
                                    <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
                                        {CATEGORIA_LABELS[p.categoria] ?? p.categoria ?? "—"}
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
);

export const DocenteDistribucionCategorias = ({ items, loading, total }) => {
    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 text-sm text-gray-400">
                Cargando distribución…
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 text-center text-sm text-gray-400">
                <FileText size={24} className="mx-auto mb-2 opacity-30" />
                Sin datos de categorías todavía.
            </div>
        );
    }

    const max = items[0]?.total ?? 1;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                Producción por categoría
            </h3>
            <div className="space-y-3">
                {items.map(({ categoria, total: count }) => (
                    <div key={categoria}>
                        <div className="flex items-center justify-between gap-2 text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-300 truncate">
                                {CATEGORIA_LABELS[categoria] ?? categoria}
                            </span>
                            <span className="text-gray-400 shrink-0">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#EC7A21] transition-all"
                                style={{ width: `${(count / max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <p className="text-[11px] text-gray-400">
                {total} producto{total !== 1 ? "s" : ""} en total
            </p>
        </div>
    );
};
