import { useEffect } from "react";
import { X, Info, Paperclip, Pencil, Download } from "lucide-react";
import { ATRIBUTO_LABELS } from "../../productoConfig";
import {
    TIPO_LABELS, SUBCATEGORIA_LABELS, CATEGORIA_LABELS,
    formatFecha, getExtensionArchivo,
    puedeEditarProducto, puedeEliminarProducto,
    MENSAJE_PRODUCTO_PUBLICADO,
} from "../productoHelpers";
import { EstadoBadge } from "./EstadoBadge";

const DetallePill = ({ label, value, accent = "border-[#EC7A21]" }) => (
    <div className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
        rounded-xl px-3 py-2.5 border-l-[3px] ${accent}`}>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
            {value || "—"}
        </p>
    </div>
);

const DetalleMeta = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
            {label}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{value || "—"}</p>
    </div>
);

export const ProductoDetalleModal = ({
    producto,
    toggling,
    onClose,
    onToggle,
    onEliminar,
    onEditar,
    onDescargar,
}) => {
    useEffect(() => {
        if (!producto) return;

        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [producto, onClose]);

    if (!producto) return null;

    const editable   = puedeEditarProducto(producto);
    const eliminable = puedeEliminarProducto(producto);
    const atributos  = Object.entries(producto.atributos ?? {});
    const togglingEste = toggling === producto.id;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-producto-titulo"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
                onClick={onClose}
                aria-label="Cerrar"
            />

            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col
                bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="shrink-0 px-6 py-5 border-b border-gray-100 dark:border-gray-700
                    bg-linear-to-br from-[#ffc20e]/10 to-[#EC7A21]/10">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 pr-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#EC7A21] mb-1">
                                Producto académico · #{producto.id}
                            </p>
                            <h2
                                id="detalle-producto-titulo"
                                className="text-lg font-extrabold text-gray-900 dark:text-gray-100 leading-snug"
                            >
                                {producto.nombre}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <EstadoBadge publicado={producto.publicado} />
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-lg
                                    text-gray-400 hover:bg-white/60 hover:text-gray-600 transition"
                                aria-label="Cerrar"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                    {!editable && (
                        <div className="flex items-start gap-2.5 p-3 rounded-xl
                            bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                            <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                                {MENSAJE_PRODUCTO_PUBLICADO}
                            </p>
                        </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl px-4 py-3.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                            Descripción
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {producto.descripcion || "Sin descripción registrada."}
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
                            Clasificación
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <DetallePill
                                label="Categoría"
                                value={CATEGORIA_LABELS[producto.categoria] ?? producto.categoria}
                            />
                            <DetallePill
                                label="Subcategoría"
                                value={SUBCATEGORIA_LABELS[producto.subcategoria] ?? producto.subcategoria}
                                accent="border-[#EFB357]"
                            />
                            <DetallePill
                                label="Tipo"
                                value={TIPO_LABELS[producto.tipo] ?? producto.tipo}
                                accent="border-[#ffc20e]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                            <DetalleMeta label="Fecha de creación" value={formatFecha(producto.fechaCreacion)} />
                        </div>
                        <div className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                            <DetalleMeta label="Fecha de publicación" value={formatFecha(producto.fechaPublicacion)} />
                        </div>
                    </div>

                    {atributos.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
                                Atributos adicionales
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {atributos.map(([k, v]) => (
                                    <div key={k}
                                        className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                                        <DetalleMeta
                                            label={ATRIBUTO_LABELS[k] ?? k}
                                            value={String(v)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {producto.nombreArchivo && (
                        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl
                            bg-linear-to-br from-orange-50 to-amber-50
                            dark:from-orange-900/20 dark:to-amber-900/10
                            border border-orange-200 dark:border-orange-800">
                            <div className="w-9 h-9 rounded-xl bg-[#EC7A21] flex items-center justify-center shrink-0">
                                <Paperclip size={16} className="text-white" />
                            </div>
                            <div className="flex-1 min-w-[140px]">
                                <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">
                                    Archivo adjunto
                                </p>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                    {producto.nombreArchivoOriginal}
                                </p>
                            </div>
                            {getExtensionArchivo(producto) && (
                                <span className="text-[10px] font-extrabold px-2 py-1 rounded-md
                                    bg-white dark:bg-gray-800 text-[#EC7A21] border border-orange-200">
                                    {getExtensionArchivo(producto)}
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={() => onDescargar(producto)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-white
                                    bg-[#EC7A21] hover:bg-[#d96a15] px-3.5 py-2 rounded-lg transition"
                            >
                                <Download size={14} /> Descargar
                            </button>
                        </div>
                    )}

                    <div className="text-center pt-1 pb-2 space-y-1">
                        {editable ? (
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    onEditar?.(producto);
                                }}
                                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#EC7A21]
                                    bg-orange-50 dark:bg-orange-900/20 border border-orange-200
                                    dark:border-orange-800 px-4 py-2 rounded-lg hover:bg-orange-100 transition"
                            >
                                <Pencil size={14} /> Editar producto
                            </button>
                        ) : (
                            <p className="text-xs text-gray-400 italic">
                                Edición no disponible mientras esté publicado
                            </p>
                        )}
                        {!eliminable && (
                            <p className="text-[11px] text-gray-400 italic">
                                Eliminación no disponible mientras esté publicado
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer acciones */}
                <div className="shrink-0 flex flex-wrap items-center justify-end gap-2
                    px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        Cerrar
                    </button>

                    {eliminable && (
                        <button
                            type="button"
                            onClick={onEliminar}
                            className="px-4 py-2 text-sm font-semibold text-white bg-red-600
                                hover:bg-red-700 rounded-lg transition"
                        >
                            Eliminar
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onToggle}
                        disabled={togglingEste}
                        className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${producto.publicado
                                ? "bg-amber-600 hover:bg-amber-700"
                                : "bg-[#EC7A21] hover:bg-[#d96a15]"
                            }`}
                    >
                        {togglingEste
                            ? "Procesando…"
                            : producto.publicado ? "Despublicar" : "Publicar"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};
