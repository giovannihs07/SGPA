import { Eye, Download, FileText } from "lucide-react";
import {
    TIPO_LABELS, CATEGORIA_LABELS, formatFecha, truncar,
    productoTieneArchivos,
} from "../../docente/components/productoHelpers";
import { ArchivoBadge } from "../../docente/components/misProductos/ArchivoBadge";
import { ProductosPaginacion } from "../../docente/components/misProductos/ProductosPaginacion";
import { card, text, btnIcon } from "../../../components/ui/themeTokens";

const nombreDocente = (p) => {
    const partes = [p.docenteNombre, p.docenteApellido].filter(Boolean);
    return partes.length ? partes.join(" ") : (p.docenteCodigo ?? "—");
};

export const ProductosTarjetas = ({
    productos,
    productosFiltrados,
    pagina,
    totalPaginas,
    pageSize,
    irPagina,
    onVer,
    onDescargar,
}) => {
    if (productosFiltrados.length === 0) {
        return (
            <div className={`${card} flex flex-col items-center justify-center py-16 text-gray-400`}>
                <FileText size={32} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">Sin resultados</p>
                <p className="text-xs mt-1 opacity-70 text-center px-4">
                    Prueba cambiando los filtros o el término de búsqueda.
                </p>
            </div>
        );
    }

    return (
        <div className={card}>
            <div className="p-3 sm:p-4 space-y-3">
                {productos.map((p) => (
                    <article
                        key={p.id}
                        className="rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50
                            dark:bg-gray-900/30 p-4 space-y-3"
                    >
                        <div className="flex items-start gap-2">
                            {productoTieneArchivos(p) && (
                                <FileText size={14} className="text-[#EC7A21] shrink-0 mt-0.5" />
                            )}
                            <div className="min-w-0 flex-1">
                                <button
                                    type="button"
                                    onClick={() => onVer(p)}
                                    className={`text-left text-sm font-bold ${text.primary} hover:text-[#EC7A21] transition line-clamp-2`}
                                >
                                    {p.nombre}
                                </button>
                                {p.descripcion && (
                                    <p className={`text-xs mt-1 line-clamp-2 ${text.muted}`}>
                                        {truncar(p.descripcion, 90)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <p className="text-[9px] font-bold uppercase text-gray-400">Docente</p>
                                <p className={`${text.secondary} line-clamp-1`}>{nombreDocente(p)}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase text-gray-400">Publicación</p>
                                <p className={text.secondary}>{formatFecha(p.fechaPublicacionSgpa)}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase text-gray-400">Categoría</p>
                                <p className={`${text.secondary} line-clamp-1`}>
                                    {CATEGORIA_LABELS[p.categoria] ?? p.categoria ?? "—"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase text-gray-400">Tipo</p>
                                <p className={`${text.secondary} line-clamp-2`}>
                                    {TIPO_LABELS[p.tipo] ?? p.tipo ?? "—"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1">
                            <ArchivoBadge producto={p} />
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => onVer(p)}
                                    title="Ver detalle"
                                    className={`${btnIcon} w-8 h-8 text-gray-600 dark:text-gray-400
                                        hover:bg-[#ffc20e]/15 hover:text-[#EC7A21]`}
                                >
                                    <Eye size={15} />
                                </button>
                                {productoTieneArchivos(p) && (
                                    <button
                                        type="button"
                                        onClick={() => onDescargar(p)}
                                        title="Descargar"
                                        className={`${btnIcon} w-8 h-8 text-gray-500 dark:text-gray-400
                                            hover:bg-orange-50 hover:text-[#EC7A21] dark:hover:bg-orange-900/20`}
                                    >
                                        <Download size={15} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <ProductosPaginacion
                pagina={pagina}
                totalPaginas={totalPaginas}
                totalItems={productosFiltrados.length}
                pageSize={pageSize}
                irPagina={irPagina}
            />
        </div>
    );
};
