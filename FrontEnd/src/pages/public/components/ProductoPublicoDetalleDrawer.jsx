import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { getProductoPublicoPorId, getProductoSchema } from "../../../services/productoServices";
import { buildEtiquetasAtributosMap } from "../../docente/components/productoFormUtils";
import { MisProductosLoading, MisProductosError } from "../../docente/components/misProductos/MisProductosEstados";
import { ProductoPublicoDetalleContent } from "./ProductoPublicoDetalleContent";
import { useArchivoPdfViewer } from "../../../hooks/useArchivoPdfViewer";
import { ArchivoPdfViewer } from "../../../components/ui/ArchivoPdfViewer";
import { descargarProductoPublico } from "../../../utils/publicProductoDownload";
import { verArchivoPublico } from "../../../utils/verArchivoProducto";

export const ProductoPublicoDetalleDrawer = ({
    productoId,
    previewProducto = null,
    onClose,
}) => {
    const [producto, setProducto] = useState(previewProducto);
    const [loading, setLoading] = useState(!previewProducto);
    const [error, setError] = useState(null);
    const [etiquetasAtributos, setEtiquetasAtributos] = useState({});
    const { visor, abrirPdf, cerrarVisor } = useArchivoPdfViewer();

    const handleVerArchivo = useCallback(
        (p, archivo) => verArchivoPublico(p, archivo, abrirPdf),
        [abrirPdf],
    );

    const cargar = useCallback(async () => {
        if (!productoId) return;
        setError(null);
        setLoading(true);
        try {
            const data = await getProductoPublicoPorId(productoId);
            setProducto(data);
        } catch (e) {
            setError(
                e.response?.data?.error
                ?? e.response?.data?.message
                ?? e.message
                ?? "No se pudo cargar el producto",
            );
        } finally {
            setLoading(false);
        }
    }, [productoId]);

    useEffect(() => {
        if (!productoId) return;
        setProducto(previewProducto);
        setError(null);
        cargar();
    }, [productoId, previewProducto, cargar]);

    useEffect(() => {
        if (!productoId) return undefined;

        const onKey = (e) => {
            if (e.key === "Escape" && !visor) onClose();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [productoId, onClose, visor]);

    useEffect(() => {
        if (!producto) {
            setEtiquetasAtributos({});
            return;
        }
        getProductoSchema()
            .then((schema) => setEtiquetasAtributos(buildEtiquetasAtributosMap(schema, producto)))
            .catch(() => setEtiquetasAtributos({}));
    }, [producto]);

    if (!productoId) return null;

    const titulo = producto?.nombre ?? previewProducto?.nombre ?? "Detalle del producto";

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end"
            role="dialog"
            aria-modal="true"
            aria-labelledby="public-producto-drawer-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
                onClick={onClose}
                aria-label="Cerrar detalle"
            />

            <div
                className="relative w-full sm:w-[min(100%,32rem)] lg:w-[min(100%,36rem)]
                    max-h-[92vh] sm:max-h-none sm:h-full
                    flex flex-col bg-white dark:bg-gray-800
                    rounded-t-2xl sm:rounded-none sm:rounded-l-2xl shadow-2xl"
            >
                <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-5 py-4
                    border-b border-gray-100 dark:border-gray-700
                    bg-linear-to-br from-[#ffc20e]/10 to-[#EC7A21]/10">
                    <div className="min-w-0 pr-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#EC7A21] mb-0.5">
                            Detalle del producto
                        </p>
                        <h2
                            id="public-producto-drawer-title"
                            className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-gray-100 truncate"
                        >
                            {titulo}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0
                            text-gray-500 hover:bg-white/70 hover:text-gray-800 dark:hover:bg-gray-700 transition"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5">
                    {loading && !producto && (
                        <MisProductosLoading />
                    )}

                    {!loading && error && !producto && (
                        <MisProductosError error={error} onRetry={cargar} />
                    )}

                    {producto && (
                        <div className={loading ? "opacity-60 pointer-events-none" : ""}>
                            <ProductoPublicoDetalleContent
                                producto={producto}
                                etiquetasAtributos={etiquetasAtributos}
                                onDescargar={descargarProductoPublico}
                                onVerArchivo={handleVerArchivo}
                                onNavigateAway={onClose}
                            />
                        </div>
                    )}

                    {loading && producto && (
                        <div className="mt-3 flex justify-center">
                            <div className="w-6 h-6 border-2 border-[#EFB357] border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            {visor && (
                <ArchivoPdfViewer
                    url={visor.url}
                    titulo={visor.titulo}
                    onClose={cerrarVisor}
                />
            )}
        </div>
    );
};
