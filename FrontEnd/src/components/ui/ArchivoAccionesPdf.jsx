import { Download, Eye } from "lucide-react";
import { esArchivoPdf } from "../../config/productoArchivo";

export const ArchivoAccionesPdf = ({
    archivo,
    producto,
    descargable,
    onVer,
    onDescargar,
    verLabel = "Ver",
}) => {
    if (!descargable) return null;

    const puedeVer = esArchivoPdf(archivo) && onVer;

    return (
        <div className="flex items-center gap-1.5 shrink-0">
            {puedeVer && (
                <button
                    type="button"
                    onClick={() => onVer(producto, archivo)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EC7A21]
                        bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800
                        hover:bg-orange-50 dark:hover:bg-orange-900/20 px-3.5 py-2 rounded-lg transition"
                >
                    <Eye size={14} /> {verLabel}
                </button>
            )}
            <button
                type="button"
                onClick={() => onDescargar(producto, archivo)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white
                    bg-[#EC7A21] hover:bg-[#d96a15] px-3.5 py-2 rounded-lg transition"
            >
                <Download size={14} /> Descargar
            </button>
        </div>
    );
};
