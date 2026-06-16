import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Download, Lock, Paperclip, User } from "lucide-react";
import { getProductoPublicoPorId, getProductoSchema } from "../../services/productoServices";
import { etiquetaRolArchivo } from "../../config/productoArchivo";
import {
    TIPO_LABELS, SUBCATEGORIA_LABELS, CATEGORIA_LABELS,
    formatFecha, etiquetaAtributo, obtenerArchivosProducto,
    puedeDescargarArchivo, etiquetaAccesoArchivo,
} from "../docente/components/productoHelpers";
import { buildEtiquetasAtributosMap } from "../docente/components/productoFormUtils";
import { descargarProductoPublico } from "../../utils/publicProductoDownload";
import { urlVistaDocente } from "../../utils/publicDocenteNav";
import { MisProductosLoading, MisProductosError } from "../docente/components/misProductos/MisProductosEstados";
import { DocenteEnlacePorNombre } from "./components/PublicDocenteBanner";
import { card, text } from "../../components/ui/themeTokens";

const DetallePill = ({ label, value, accent = "border-[#EC7A21]" }) => (
    <div className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
        rounded-xl px-3 py-2.5 border-l-[3px] ${accent}`}>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{value || "—"}</p>
    </div>
);

const DetalleMeta = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{value || "—"}</p>
    </div>
);

const FilaArchivoPublico = ({ archivo, producto, onDescargar }) => {
    const ext = archivo.extensionArchivo
        ?? (archivo.nombreOriginal?.includes(".")
            ? archivo.nombreOriginal.split(".").pop().toUpperCase()
            : null);
    const descargable = puedeDescargarArchivo(archivo);

    return (
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border
            bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10
            border-orange-200 dark:border-orange-800">
            <div className="w-9 h-9 rounded-xl bg-[#EC7A21] flex items-center justify-center shrink-0">
                <Paperclip size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-[140px]">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">
                    {etiquetaRolArchivo(archivo.rol)} · {etiquetaAccesoArchivo(archivo)}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {archivo.nombreOriginal}
                </p>
            </div>
            {ext && (
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-md
                    bg-white dark:bg-gray-800 text-[#EC7A21] border border-orange-200">
                    {ext}
                </span>
            )}
            {descargable && (
                <button
                    type="button"
                    onClick={() => onDescargar(producto, archivo)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white
                        bg-[#EC7A21] hover:bg-[#d96a15] px-3.5 py-2 rounded-lg transition"
                >
                    <Download size={14} /> Descargar
                </button>
            )}
        </div>
    );
};

const nombreDocente = (p) => {
    const partes = [p?.docenteNombre, p?.docenteApellido].filter(Boolean);
    return partes.length ? partes.join(" ") : null;
};

export const ProductoPublicoDetallePage = () => {
    const { id } = useParams();
    const location = useLocation();
    const catalogoUrl = `/portal/public${location.state?.fromSearch ?? ""}`;
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [etiquetasAtributos, setEtiquetasAtributos] = useState({});

    const cargar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setProducto(await getProductoPublicoPorId(id));
        } catch (e) {
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "No se pudo cargar el producto");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { cargar(); }, [cargar]);

    useEffect(() => {
        if (!producto) return;
        getProductoSchema()
            .then((schema) => setEtiquetasAtributos(buildEtiquetasAtributosMap(schema, producto)))
            .catch(() => setEtiquetasAtributos({}));
    }, [producto]);

    if (loading) return <MisProductosLoading />;
    if (error || !producto) {
        return (
            <div className="p-6 max-w-3xl mx-auto space-y-4">
                <Link
                    to={catalogoUrl}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#EC7A21] hover:underline"
                >
                    <ArrowLeft size={16} /> Volver al catálogo
                </Link>
                <MisProductosError error={error ?? "Producto no encontrado"} onRetry={cargar} />
            </div>
        );
    }

    const archivos = obtenerArchivosProducto(producto).filter((a) => a.accesoPublico !== false);
    const atributos = Object.entries(producto.atributos ?? {});
    const docente = nombreDocente(producto);
    const programas = producto.programas?.length ? [...producto.programas].join(", ") : null;

    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
            <Link
                to={catalogoUrl}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#EC7A21] hover:underline"
            >
                <ArrowLeft size={16} /> Volver al catálogo
            </Link>

            <article className={`${card} p-5 sm:p-6 space-y-5`}>
                <header className="border-b border-gray-100 dark:border-gray-700 pb-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#EC7A21] mb-1">
                        Producto académico
                    </p>
                    <h1 className={`text-xl sm:text-2xl font-extrabold ${text.primary} leading-snug`}>
                        {producto.nombre}
                    </h1>
                    {docente && (
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <p className={`text-sm flex items-center gap-1.5 ${text.muted}`}>
                                <User size={14} className="shrink-0" aria-hidden="true" />
                                <DocenteEnlacePorNombre
                                    nombre={docente}
                                    className="font-semibold text-gray-800 dark:text-gray-200"
                                />
                            </p>
                            {urlVistaDocente(producto) && (
                                <Link
                                    to={urlVistaDocente(producto)}
                                    className="text-xs font-semibold text-[#EC7A21] hover:underline"
                                >
                                    Ver más productos de este docente
                                </Link>
                            )}
                        </div>
                    )}
                    {programas && (
                        <p className={`text-xs mt-1 ${text.muted}`}>Programas: {programas}</p>
                    )}
                </header>

                <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Descripción</p>
                    <p className={`text-sm leading-relaxed ${text.secondary}`}>
                        {producto.descripcion || "Sin descripción registrada."}
                    </p>
                </section>

                <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Clasificación</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <DetallePill label="Categoría" value={CATEGORIA_LABELS[producto.categoria] ?? producto.categoria} />
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
                </section>

                <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Fechas</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                            <DetalleMeta label="Registrado en SGPA" value={formatFecha(producto.fechaRegistroSgpa)} />
                        </div>
                        <div className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                            <DetalleMeta label="Publicado en SGPA" value={formatFecha(producto.fechaPublicacionSgpa)} />
                        </div>
                    </div>
                </section>

                {atributos.length > 0 && (
                    <section>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
                            Datos académicos
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {atributos.map(([k, v]) => (
                                <div key={k} className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                                    <DetalleMeta
                                        label={etiquetaAtributo(k, etiquetasAtributos)}
                                        value={String(v)}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Archivos disponibles ({archivos.length})
                    </p>
                    {archivos.length === 0 ? (
                        <div className="flex items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-500">
                            <Lock size={16} /> No hay archivos públicos disponibles para este producto.
                        </div>
                    ) : (
                        archivos.map((archivo) => (
                            <FilaArchivoPublico
                                key={archivo.id ?? archivo.nombreOriginal}
                                archivo={archivo}
                                producto={producto}
                                onDescargar={descargarProductoPublico}
                            />
                        ))
                    )}
                </section>
            </article>
        </div>
    );
};
