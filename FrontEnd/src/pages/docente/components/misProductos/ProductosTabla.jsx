import { Download, Globe, GlobeLock, Trash2, Eye, Pencil, FileText } from "lucide-react";
import { TIPO_LABELS, CATEGORIA_LABELS, formatFecha, truncar, puedeEditarProducto, puedeEliminarProducto, MENSAJE_EDICION_BLOQUEADA, MENSAJE_ELIMINACION_BLOQUEADA } from "../productoHelpers";
import { EstadoBadge } from "./EstadoBadge";
import { ArchivoBadge } from "./ArchivoBadge";
import { ProductosPaginacion } from "./ProductosPaginacion";

const COLUMNAS = ["Nombre", "Tipo", "Categoría", "Estado", "Fecha", "Archivo", "Acciones"];

// Componente para las acciones de la fila de la tabla de productos
const AccionesFila = ({ producto, toggling, onVer, onEditar, onToggle, onDescargar, onEliminar }) => {
    const editBloqueado = !puedeEditarProducto(producto);
    const elimBloqueado = !puedeEliminarProducto(producto);

    return (
    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
        <button
            onClick={() => onVer(producto)}
            title="Ver detalle"
            className="w-7 h-7 flex items-center justify-center rounded-lg
                text-gray-500 hover:bg-[#ffc20e]/15 hover:text-[#EC7A21] transition"
        >
            <Eye size={14} />
        </button>

        <button
            onClick={() => onEditar(producto)}
            title={editBloqueado ? MENSAJE_EDICION_BLOQUEADA : "Editar"}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition
                ${editBloqueado
                    ? "text-gray-300 cursor-not-allowed opacity-50"
                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                }`}
        >
            <Pencil size={14} />
        </button>
        <button
            onClick={() => onToggle(producto)}
            disabled={toggling === producto.id}
            title={producto.publicado ? "Despublicar" : "Publicar"}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition
                disabled:opacity-40 disabled:cursor-not-allowed
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

        {producto.nombreArchivo && (
            <button
                onClick={() => onDescargar(producto)}
                title="Descargar archivo"
                className="w-7 h-7 flex items-center justify-center rounded-lg
                    text-gray-400 hover:bg-orange-50 hover:text-[#EC7A21]
                    dark:hover:bg-orange-900/20 transition"
            >
                <Download size={14} />
            </button>
        )}

        <button
            onClick={() => onEliminar(producto)}
            title={elimBloqueado ? MENSAJE_ELIMINACION_BLOQUEADA : "Eliminar"}
            className={`w-7 h-7 flex items-center justify-center rounded-lg transition
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
}) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100
        dark:border-gray-700 overflow-hidden">

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
                            <tr className="border-b border-gray-100 dark:border-gray-700
                                bg-linear-to-r from-[#ffc20e]/5 to-transparent dark:from-[#ffc20e]/10">
                                {COLUMNAS.map((h) => (
                                    <th key={h}
                                        className="px-4 py-3 text-left text-[10px] font-bold
                                            uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {productos.map((p) => (
                                <tr key={p.id}
                                    className="hover:bg-[#ffc20e]/5 dark:hover:bg-[#ffc20e]/5 transition group">
                                    <td className="px-4 py-3 max-w-55">
                                        <div className="flex items-start gap-2">
                                            {p.nombreArchivo && (
                                                <FileText size={13} className="text-[#EC7A21] shrink-0 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-gray-100
                                                    leading-snug line-clamp-2 text-xs">{p.nombre}</p>
                                                {p.descripcion && (
                                                    <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                                                        {truncar(p.descripcion, 55)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 max-w-37.5">
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
