import { useEffect, useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import { getProductosPublicos } from "../../../services/productoServices";
import { ProductoPublicoCard } from "./ProductoPublicoCard";
import { card, text } from "../../../components/ui/themeTokens";

const CANTIDAD_RECIENTES = 6;

export const PublicRecientesSection = ({ onVer, onDescargar, onVerCatalogo }) => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProductosPublicos({
            page: 0,
            size: CANTIDAD_RECIENTES,
            sort: "fechaPublicacionSgpa,desc",
        })
            .then((data) => setProductos(data.content ?? []))
            .catch(() => setProductos([]))
            .finally(() => setLoading(false));
    }, []);

    if (!loading && productos.length === 0) return null;

    return (
        <section aria-labelledby="publicaciones-recientes-titulo" className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-[#EC7A21]" aria-hidden="true" />
                    <h2
                        id="publicaciones-recientes-titulo"
                        className="text-sm font-bold text-gray-900 dark:text-white"
                    >
                        Publicaciones recientes
                    </h2>
                </div>
                <button
                    type="button"
                    onClick={onVerCatalogo}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#EC7A21] hover:underline"
                >
                    Ver catálogo completo
                    <ChevronRight size={14} />
                </button>
            </div>

            {loading ? (
                <div className={`${card} p-4 flex gap-3 overflow-hidden`}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="min-w-[260px] h-44 rounded-xl bg-gray-100 dark:bg-gray-700 animate-pulse shrink-0"
                        />
                    ))}
                </div>
            ) : (
                <div className={`${card} p-3 sm:p-4`}>
                    <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-thin">
                        {productos.map((p) => (
                            <ProductoPublicoCard
                                key={p.id}
                                producto={p}
                                onVer={onVer}
                                onDescargar={onDescargar}
                                compacto
                            />
                        ))}
                    </div>
                </div>
            )}

            <p className={`text-[11px] ${text.muted}`}>
                Últimos {CANTIDAD_RECIENTES} productos publicados en SGPA, ordenados por fecha de publicación.
            </p>
        </section>
    );
};
