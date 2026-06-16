import { Download, Eye } from "lucide-react";
import {
    TIPO_LABELS, formatFecha, truncar, productoTieneArchivos, obtenerArchivosProducto,
} from "../../docente/components/productoHelpers";
import { btnIcon, text } from "../../../components/ui/themeTokens";
import { DocenteEnlace } from "./PublicDocenteBanner";
import {
    inicialesDocente, formatFechaRelativa,
    categoriaBadgeClass, etiquetaCategoria, iconoArchivo,
} from "./publicProductoUi";

const ArchivoChip = ({ producto }) => {
    const archivos = obtenerArchivosProducto(producto);
    if (!archivos.length) return null;

    const principal = archivos.find((a) => a.rol === "PRINCIPAL") ?? archivos[0];
    const ext = principal.extensionArchivo
        ?? (principal.nombreOriginal?.includes(".")
            ? principal.nombreOriginal.split(".").pop().toUpperCase()
            : "FILE");
    const Icon = iconoArchivo(ext);

    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold
            bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20 dark:text-[#EFB357]">
            <Icon size={11} aria-hidden="true" />
            {archivos.length > 1 ? `${ext} +${archivos.length - 1}` : ext}
        </span>
    );
};

const DocenteRow = ({ producto }) => (
    <div className="flex items-center gap-2 min-w-0">
        <span className="w-7 h-7 rounded-full bg-[#222222] text-[#ffc20e] text-[10px] font-bold
            flex items-center justify-center shrink-0">
            {inicialesDocente(producto)}
        </span>
        <DocenteEnlace
            producto={producto}
            className={`text-xs ${text.secondary} line-clamp-1 font-medium`}
        />
    </div>
);

const FechaPublicacion = ({ fecha }) => {
    const relativa = formatFechaRelativa(fecha);
    const absoluta = formatFecha(fecha);

    return (
        <div>
            {relativa && (
                <p className={`text-xs font-medium ${text.primary}`}>{relativa}</p>
            )}
            <p className={`text-[10px] ${text.muted}`}>{absoluta}</p>
        </div>
    );
};

const AccionesCard = ({ producto, onVer, onDescargar, mostrarVerTexto = false }) => (
    <div className="flex items-center gap-1.5">
        <button
            type="button"
            onClick={() => onVer(producto)}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#EC7A21]
                hover:text-[#d96a15] transition ${mostrarVerTexto ? "px-2 py-1" : `${btnIcon} w-8 h-8 text-gray-600 dark:text-gray-400 hover:bg-[#ffc20e]/15`}`}
        >
            <Eye size={14} />
            {mostrarVerTexto && <span>Ver detalle</span>}
        </button>
        {productoTieneArchivos(producto) && (
            <button
                type="button"
                onClick={() => onDescargar(producto)}
                title="Descargar"
                className={`${btnIcon} w-8 h-8 text-gray-500 dark:text-gray-400
                    hover:bg-orange-50 hover:text-[#EC7A21] dark:hover:bg-orange-900/20`}
            >
                <Download size={15} />
            </button>
        )}
    </div>
);

export const ProductoPublicoCard = ({
    producto,
    onVer,
    onDescargar,
    compacto = false,
}) => {
    const categoria = producto.categoria;
    const tipoLabel = TIPO_LABELS[producto.tipo] ?? producto.tipo;

    if (compacto) {
        return (
            <article
                className="min-w-[260px] max-w-[300px] shrink-0 rounded-xl border border-gray-100
                    dark:border-gray-700 bg-white dark:bg-gray-800 p-4 space-y-3 flex flex-col
                    hover:shadow-md hover:border-[#ffc20e]/40 transition snap-start"
            >
                <div className="flex flex-wrap items-center gap-1.5">
                    {categoria && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoriaBadgeClass(categoria)}`}>
                            {etiquetaCategoria(categoria)}
                        </span>
                    )}
                    {tipoLabel && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full
                            bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {tipoLabel}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    onClick={() => onVer(producto)}
                    className={`text-left text-sm font-bold ${text.primary} hover:text-[#EC7A21] transition line-clamp-2`}
                >
                    {producto.nombre}
                </button>

                <DocenteRow producto={producto} />
                <FechaPublicacion fecha={producto.fechaPublicacionSgpa} />

                <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
                    <ArchivoChip producto={producto} />
                    <AccionesCard producto={producto} onVer={onVer} onDescargar={onDescargar} />
                </div>
            </article>
        );
    }

    return (
        <article
            className="group rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50
                dark:bg-gray-900/30 p-4 space-y-3 flex flex-col
                hover:shadow-md hover:border-[#ffc20e]/40 transition"
        >
            <div className="flex flex-wrap items-center gap-1.5">
                {categoria && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${categoriaBadgeClass(categoria)}`}>
                        {etiquetaCategoria(categoria)}
                    </span>
                )}
                {tipoLabel && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full
                        bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 line-clamp-1 max-w-full">
                        {tipoLabel}
                    </span>
                )}
            </div>

            <div className="min-w-0">
                <button
                    type="button"
                    onClick={() => onVer(producto)}
                    className={`text-left text-sm font-bold ${text.primary} group-hover:text-[#EC7A21] transition line-clamp-2`}
                >
                    {producto.nombre}
                </button>
                {producto.descripcion && (
                    <p className={`text-xs mt-1 line-clamp-2 ${text.muted}`}>
                        {truncar(producto.descripcion, 90)}
                    </p>
                )}
            </div>

            <DocenteRow producto={producto} />
            <FechaPublicacion fecha={producto.fechaPublicacionSgpa} />

            <div className="flex items-center justify-between gap-2 pt-1 mt-auto">
                <ArchivoChip producto={producto} />
                <AccionesCard
                    producto={producto}
                    onVer={onVer}
                    onDescargar={onDescargar}
                    mostrarVerTexto
                />
            </div>
        </article>
    );
};
