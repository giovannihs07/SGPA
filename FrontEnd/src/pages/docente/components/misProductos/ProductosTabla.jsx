import { Download, Globe, GlobeLock, Trash2, Eye, Pencil, FileText } from "lucide-react";
import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellSecondary, tableCellMuted, tableCellSubtext,
    btnIcon,
} from "../../../../components/ui/themeTokens";
import {
    TIPO_LABELS, CATEGORIA_LABELS, formatFecha, truncar,
    puedeEditarProducto, puedeEliminarProducto,
    MENSAJE_EDICION_BLOQUEADA, MENSAJE_ELIMINACION_BLOQUEADA,
    productoTieneArchivos,
} from "../productoHelpers";
import { EstadoBadge } from "./EstadoBadge";
import { ArchivoBadge } from "./ArchivoBadge";
import { ProductosPaginacion } from "./ProductosPaginacion";

const COLUMNAS_BASE = ["Nombre", "Tipo", "Categoría", "Estado", "Fecha", "Archivo", "Acciones"];

// Componente para las acciones de la fila de la tabla de productos
const AccionesFila = ({
    producto, toggling, onVer, onEditar, onToggle, onDescargar, onEliminar,
    mostrarEditar = true,
}) => {
    const editBloqueado = !puedeEditarProducto(producto);
    const elimBloqueado = !puedeEliminarProducto(producto);

    return (
    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
        <button
            onClick={() => onVer(producto)}
            title="Ver detalle"
            className={`${btnIcon} w-7 h-7 text-gray-600 dark:text-gray-400 hover:bg-[#ffc20e]/15 hover:text-[#EC7A21]`}
        >
            <Eye size={14} />
        </button>

        {mostrarEditar && (
        <button
            onClick={() => onEditar(producto)}
            title={editBloqueado ? MENSAJE_EDICION_BLOQUEADA : "Editar"}
            className={`${btnIcon} w-7 h-7 transition
                ${editBloqueado
                    ? "text-gray-300 cursor-not-allowed opacity-50"
                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                }`}
        >
            <Pencil size={14} />
        </button>
        )}
        <button
            onClick={() => onToggle(producto)}
            disabled={toggling === producto.id}
            title={producto.publicado ? "Despublicar" : "Publicar"}
            className={`${btnIcon} w-7 h-7 transition disabled:opacity-40 disabled:cursor-not-allowed
                ${producto.publicado
                    ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    : "text-gray-400 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/20"
                }`}
        >
            {toggling === producto.id
                ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                : producto.publicado
                    ? <Globe size={14} />
                    : <GlobeLock size={14} />
            }
        </button>

        {productoTieneArchivos(producto) && (
            <button
                onClick={() => onDescargar(producto)}
                title="Descargar archivo principal"
                className={`${btnIcon} w-7 h-7 text-gray-500 dark:text-gray-400 hover:bg-orange-50 hover:text-[#EC7A21] dark:hover:bg-orange-900/20`}
            >
                <Download size={14} />
            </button>
        )}

        <button
            onClick={() => onEliminar(producto)}
            title={elimBloqueado ? MENSAJE_ELIMINACION_BLOQUEADA : "Eliminar"}
            className={`${btnIcon} w-7 h-7 transition
                ${elimBloqueado
                    ? "text-gray-300 cursor-not-allowed opacity-50"
                    : "text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                }`}
        >
            <Trash2 size={14} />
        </button>
    </div>
    );
};

// Componente principal para la tabla de productos con los productos filtrados
export const ProductosTabla = ({
    productos, productosFiltrados,
    pagina, totalPaginas, pageSize, irPagina,
    toggling, onVer, onEditar, onToggle, onDescargar, onEliminar,
    mostrarEditar = true,
    mostrarDocente = false,
}) => {
    const columnas = mostrarDocente
        ? ["Nombre", "Docente", "Tipo", "Categoría", "Estado", "Fecha", "Archivo", "Acciones"]
        : COLUMNAS_BASE;

    return (
    <div className={tableWrapper}>

        {/* Si no hay productos filtrados, se muestra el mensaje de sin resultados */}
        {productosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <FileText size={32} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">Sin resultados</p>
                <p className="text-xs mt-1 opacity-70">
                    Prueba cambiando los filtros o registra un nuevo producto.
                </p>
            </div>
        ) : (
            <>
                {/* Se renderiza la tabla de productos */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={tableHeadRow}>
                                {columnas.map((h) => (
                                    <th key={h} className={tableHeadCell}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className={tableBody}>
                            {productos.map((p) => (
                                <tr key={p.id} className={`${tableRow} group`}>
                                    <td className="px-4 py-3 max-w-55">
                                        <div className="flex items-start gap-2">
                                            {productoTieneArchivos(p) && (
                                                <FileText size={13} className="text-[#EC7A21] shrink-0 mt-0.5" />
                                            )}
                                            <div>
                                                <p className={`${tableCellPrimary} leading-snug line-clamp-2`}>{p.nombre}</p>
                                                {p.descripcion && (
                                                    <p className={`${tableCellSubtext} mt-0.5 line-clamp-1`}>
                                                        {truncar(p.descripcion, 55)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    {mostrarDocente && (
                                        <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
                                            #{p.docenteId ?? "—"}
                                        </td>
                                    )}
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
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <ArchivoBadge producto={p} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <AccionesFila
                                            producto={p}
                                            toggling={toggling}
                                            onVer={onVer}
                                            onEditar={onEditar}
                                            onToggle={onToggle}
                                            onDescargar={onDescargar}
                                            onEliminar={onEliminar}
                                            mostrarEditar={mostrarEditar}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ProductosPaginacion
                    pagina={pagina}
                    totalPaginas={totalPaginas}
                    totalItems={productosFiltrados.length}
                    pageSize={pageSize}
                    irPagina={irPagina}
                />
            </>
        )}
    </div>
    );
};
