import { RefreshCw, Search } from "lucide-react";
import { Globe, GlobeLock, Trash2 } from "lucide-react";
import { TIPO_LABELS, CATEGORIA_LABELS, formatFecha } from "../../docente/components/productoHelpers";
import { EstadoBadge } from "../../docente/components/misProductos/EstadoBadge";

export const ProductosAdminTabla = ({
    productos, toggling, onToggle, onEliminar,
}) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100
        dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700
                        bg-linear-to-r from-[#ffc20e]/5 to-transparent">
                        {["Producto", "Tipo", "Categoría", "Estado", "Fecha", "Acciones"].map((h) => (
                            <th key={h}
                                className="px-4 py-3 text-left text-[10px] font-bold uppercase
                                    tracking-widest text-gray-400 whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {productos.map((p) => (
                        <tr key={p.id} className="hover:bg-[#ffc20e]/5 transition group">
                            <td className="px-4 py-3 max-w-55">
                                <p className="font-medium text-gray-800 dark:text-gray-100 text-xs line-clamp-2">
                                    {p.nombre}
                                </p>
                                {p.docenteId && (
                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                        Docente #{p.docenteId}
                                    </p>
                                )}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-600 max-w-37.5">
                                <span className="line-clamp-2">{TIPO_LABELS[p.tipo] ?? p.tipo ?? "—"}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                {CATEGORIA_LABELS[p.categoria] ?? p.categoria ?? "—"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <EstadoBadge publicado={p.publicado} />
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                                {formatFecha(p.fechaCreacion)}
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
                                    <button
                                        onClick={() => onToggle(p)}
                                        disabled={toggling === p.id}
                                        title={p.publicado ? "Despublicar" : "Publicar"}
                                        className={`w-7 h-7 flex items-center justify-center rounded-lg transition
                                            disabled:opacity-40
                                            ${p.publicado
                                                ? "text-green-600 hover:bg-green-50"
                                                : "text-gray-400 hover:bg-amber-50 hover:text-amber-600"
                                            }`}
                                    >
                                        {toggling === p.id
                                            ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            : p.publicado ? <Globe size={14} /> : <GlobeLock size={14} />
                                        }
                                    </button>
                                    <button
                                        onClick={() => onEliminar(p)}
                                        title="Eliminar"
                                        className="w-7 h-7 flex items-center justify-center rounded-lg
                                            text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export const AdminFiltrosBar = ({
    busqueda, setBusqueda, filtroEstado, setFiltroEstado,
    estados, placeholder, onRefresh,
}) => (
    <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200
                    dark:border-gray-700 bg-white dark:bg-gray-800
                    focus:outline-none focus:ring-2 focus:ring-[#ffc20e]/40"
            />
        </div>
        <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#ffc20e]/40"
        >
            {estados.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
        {onRefresh && (
            <button
                onClick={onRefresh}
                title="Actualizar"
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700
                    text-gray-500 hover:text-[#EC7A21] hover:border-[#ffc20e]/40 transition"
            >
                <RefreshCw size={16} />
            </button>
        )}
    </div>
);
