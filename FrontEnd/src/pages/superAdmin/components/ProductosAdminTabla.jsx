import { RefreshCw, Search } from "lucide-react";
import { Globe, GlobeLock, Trash2 } from "lucide-react";
import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellSecondary, tableCellMuted,
    inputSm, selectSm, inputIcon, btnIcon, filtroCampoIgual,
} from "../../../components/ui/themeTokens";
import { TIPO_LABELS, CATEGORIA_LABELS, formatFecha } from "../../docente/components/productoHelpers";
import { EstadoBadge } from "../../docente/components/misProductos/EstadoBadge";

export const ProductosAdminTabla = ({
    productos, toggling, onToggle, onEliminar,
}) => (
    <div className={tableWrapper}>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className={tableHeadRow}>
                        {["Producto", "Tipo", "Categoría", "Estado", "Fecha", "Acciones"].map((h) => (
                            <th key={h} className={tableHeadCell}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className={tableBody}>
                    {productos.map((p) => (
                        <tr key={p.id} className={`${tableRow} group`}>
                            <td className="px-4 py-3 max-w-55">
                                <p className={`${tableCellPrimary} line-clamp-2`}>
                                    {p.nombre}
                                </p>
                                {p.docenteId && (
                                    <p className={`${tableCellMuted} text-[10px] mt-0.5`}>
                                        Docente #{p.docenteId}
                                    </p>
                                )}
                            </td>
                            <td className={`px-4 py-3 ${tableCellSecondary} max-w-37.5`}>
                                <span className="line-clamp-2">{TIPO_LABELS[p.tipo] ?? p.tipo ?? "—"}</span>
                            </td>
                            <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
                                {CATEGORIA_LABELS[p.categoria] ?? p.categoria ?? "—"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <EstadoBadge publicado={p.publicado} />
                            </td>
                            <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
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
    filtroPerfil, setFiltroPerfil, perfiles,
    estados, placeholder, onRefresh,
}) => (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full">
        <div className={`relative ${filtroCampoIgual}`}>
            <Search size={14} className={inputIcon} aria-hidden="true" />
            <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className={`${inputSm} pl-9 w-full h-full`}
            />
        </div>
        {perfiles && setFiltroPerfil && (
            <select
                value={filtroPerfil}
                onChange={(e) => setFiltroPerfil(e.target.value)}
                aria-label="Filtrar por perfil"
                className={`${selectSm} ${filtroCampoIgual}`}
            >
                {perfiles.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
        )}
        <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            aria-label="Filtrar por estado"
            className={`${selectSm} ${filtroCampoIgual}`}
        >
            {estados.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
            ))}
        </select>
        {onRefresh && (
            <button
                onClick={onRefresh}
                title="Actualizar"
                aria-label="Actualizar listado"
                className={`${btnIcon} px-3 py-2 border border-gray-300 dark:border-gray-600 shrink-0 self-stretch
                    text-gray-600 dark:text-gray-400 hover:text-[#EC7A21] hover:border-[#ffc20e]/40`}
            >
                <RefreshCw size={16} />
            </button>
        )}
    </div>
);
