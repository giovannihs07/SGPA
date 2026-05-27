import { FileText } from "lucide-react";
import { getExtensionArchivo } from "../productoHelpers";

export const ArchivoBadge = ({ producto }) => {
    const ext = getExtensionArchivo(producto);
    if (!producto.nombreArchivo) {
        return <span className="text-xs text-gray-300 dark:text-gray-600">—</span>;
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold
            bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20 dark:text-[#EFB357]">
            <FileText size={11} />
            {ext ?? "FILE"}
        </span>
    );
};
