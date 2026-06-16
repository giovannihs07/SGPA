import { useCallback, useEffect, useState } from "react";
import { X, Info, Paperclip, Pencil, Lock } from "lucide-react";
import { getProductoSchema } from "../../../../services/productoServices";
import { etiquetaRolArchivo } from "../../../../config/productoArchivo";
import {
    TIPO_LABELS, SUBCATEGORIA_LABELS, CATEGORIA_LABELS,
    formatFecha, etiquetaAtributo, obtenerArchivosProducto,
    puedeEditarProducto, puedeEliminarProducto,
    puedeDescargarArchivo, etiquetaAccesoArchivo, esVistaAdminArchivos,
    MENSAJE_PRODUCTO_PUBLICADO,
} from "../productoHelpers";
import { buildEtiquetasAtributosMap } from "../productoFormUtils";
import { EstadoBadge } from "./EstadoBadge";
import { ArchivoAccionesPdf } from "../../../../components/ui/ArchivoAccionesPdf";
import { ArchivoPdfViewer } from "../../../../components/ui/ArchivoPdfViewer";
import { useArchivoPdfViewer } from "../../../../hooks/useArchivoPdfViewer";
import { verArchivoDocente } from "../../../../utils/verArchivoProducto";

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

const FilaArchivoDetalle = ({ archivo, producto, onVer, onDescargar }) => {
    const ext = archivo.extensionArchivo
        ?? (archivo.nombreOriginal?.includes(".")
            ? archivo.nombreOriginal.split(".").pop().toUpperCase()
            : null);
    const restringido = !archivo.accesoPublico;
    const descargable = puedeDescargarArchivo(archivo);

    return (
        <div
            className={`flex flex-wrap items-center gap-3 p-4 rounded-xl border
                ${restringido
                    ? "bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-600"
                    : "bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 border-orange-200 dark:border-orange-800"
                }`}
        >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                ${restringido ? "bg-gray-400" : "bg-[#EC7A21]"}`}>
                {restringido ? <Lock size={16} className="text-white" /> : <Paperclip size={16} className="text-white" />}
            </div>
            <div className="flex-1 min-w-[140px]">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">
                    {etiquetaRolArchivo(archivo.rol)} · {etiquetaAccesoArchivo(archivo)}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {archivo.nombreOriginal}
                </p>
                {!descargable && (
                    <p className="text-[11px] text-gray-400 mt-0.5 italic">
                        Solo el docente dueño puede descargarlo
                    </p>
                )}
            </div>
            {ext && (
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-md
                    bg-white dark:bg-gray-800 text-[#EC7A21] border border-orange-200">
                    {ext}
                </span>
            )}
            {descargable && (
                <ArchivoAccionesPdf
                    archivo={archivo}
                    producto={producto}
                    descargable={descargable}
                    onVer={onVer}
                    onDescargar={onDescargar}
                />
            )}
        </div>
    );
};

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
    permitirEditar = true,
}) => {
    const [etiquetasAtributos, setEtiquetasAtributos] = useState({});
    const { visor, abrirPdf, cerrarVisor } = useArchivoPdfViewer();

    const handleVerArchivo = useCallback(
        (p, archivo) => verArchivoDocente(p, archivo, abrirPdf),
        [abrirPdf],
    );

    useEffect(() => {
        if (!producto) return;

        const onKey = (e) => {
            if (e.key === "Escape" && !visor) onClose();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [producto, onClose, visor]);

    useEffect(() => {
        if (!producto) cerrarVisor();
    }, [producto, cerrarVisor]);

    useEffect(() => {
        if (!producto) {
            setEtiquetasAtributos({});
            return;
        }
        getProductoSchema()
            .then((schema) => setEtiquetasAtributos(buildEtiquetasAtributosMap(schema, producto)))
            .catch(() => setEtiquetasAtributos({}));
    }, [producto]);

    if (!producto) return null;

    const editable   = permitirEditar && puedeEditarProducto(producto);
    const eliminable = puedeEliminarProducto(producto);
    const atributos  = Object.entries(producto.atributos ?? {});
    const archivos   = obtenerArchivosProducto(producto);
    const vistaAdmin = esVistaAdminArchivos(archivos);
    const archivosPublicos = archivos.filter((a) => a.accesoPublico);
    const archivosRestringidos = archivos.filter((a) => !a.accesoPublico);
    const togglingEste = toggling === producto.id;

    return (
        <>
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

                    {!editable && permitirEditar && (
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

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
                            Información en SGPA
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                                <DetalleMeta
                                    label="Registrado en SGPA"
                                    value={formatFecha(producto.fechaRegistroSgpa)}
                                />
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                                <DetalleMeta
                                    label="Publicado en SGPA"
                                    value={formatFecha(producto.fechaPublicacionSgpa)}
                                />
                            </div>
                        </div>
                    </div>

                    {atributos.length > 0 && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
                                Datos académicos del producto
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {atributos.map(([k, v]) => (
                                    <div key={k}
                                        className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                                        <DetalleMeta
                                            label={etiquetaAtributo(k, etiquetasAtributos)}
                                            value={String(v)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {archivos.length > 0 && (
                        <div className="space-y-3">
                            {vistaAdmin ? (
                                <>
                                    {archivosPublicos.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                Archivos públicos ({archivosPublicos.length})
                                            </p>
                                            {archivosPublicos.map((archivo) => (
                                                <FilaArchivoDetalle
                                                    key={archivo.id ?? archivo.nombreOriginal}
                                                    archivo={archivo}
                                                    producto={producto}
                                                    onVer={handleVerArchivo}
                                                    onDescargar={onDescargar}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {archivosRestringidos.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                Archivos restringidos ({archivosRestringidos.length})
                                            </p>
                                            {archivosRestringidos.map((archivo) => (
                                                <FilaArchivoDetalle
                                                    key={archivo.id ?? archivo.nombreOriginal}
                                                    archivo={archivo}
                                                    producto={producto}
                                                    onVer={handleVerArchivo}
                                                    onDescargar={onDescargar}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                        Archivos adjuntos ({archivos.length})
                                    </p>
                                    {archivos.map((archivo) => (
                                        <FilaArchivoDetalle
                                            key={archivo.id ?? archivo.nombreOriginal}
                                            archivo={archivo}
                                            producto={producto}
                                            onVer={handleVerArchivo}
                                            onDescargar={onDescargar}
                                        />
                                    ))}
                                </>
                            )}
                        </div>
                    )}

                    {permitirEditar && (
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
                    )}
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

        {visor && (
            <ArchivoPdfViewer
                url={visor.url}
                titulo={visor.titulo}
                onClose={cerrarVisor}
            />
        )}
        </>
    );
};
