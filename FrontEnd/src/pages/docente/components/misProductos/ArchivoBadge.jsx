import { FileText } from "lucide-react";
import { obtenerArchivosProducto } from "../productoHelpers";

export const ArchivoBadge = ({ producto }) => {
    const archivos = obtenerArchivosProducto(producto);
    if (!archivos.length) {
        return <span className="text-xs text-gray-300 dark:text-gray-600">—</span>;
    }
    const principal = archivos.find((a) => a.rol === "PRINCIPAL") ?? archivos[0];
    const ext = principal.extensionArchivo
        ?? (principal.nombreOriginal?.includes(".")
            ? principal.nombreOriginal.split(".").pop().toUpperCase()
            : "FILE");
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold
            bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20 dark:text-[#EFB357]">
            <FileText size={11} />
            {archivos.length > 1 ? `${ext} +${archivos.length - 1}` : ext}
        </span>
    );
};
