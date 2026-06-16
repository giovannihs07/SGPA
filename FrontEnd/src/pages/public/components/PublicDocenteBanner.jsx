import { Link } from "react-router-dom";
import { User, X } from "lucide-react";
import { inicialesDocente, nombreDocente } from "./publicProductoUi";
import { card, focusRing } from "../../../components/ui/themeTokens";
import { urlVistaDocente, urlVistaDocentePorNombre } from "../../../utils/publicDocenteNav";

export const PublicDocenteBanner = ({ nombre, total, loading, onQuitar }) => {
    if (!nombre) return null;

    const partes = nombre.trim().split(/\s+/);
    const productoRef = {
        docenteNombre: partes[0],
        docenteApellido: partes.slice(1).join(" "),
    };

    return (
        <div className={`${card} p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4
            border-l-4 border-l-[#EC7A21] bg-[#ffc20e]/5 dark:bg-[#ffc20e]/5`}>
            <div className="flex items-center gap-3 min-w-0">
                <span className="w-11 h-11 rounded-full bg-[#222222] text-[#ffc20e] text-sm font-bold
                    flex items-center justify-center shrink-0">
                    {inicialesDocente(productoRef)}
                </span>
                <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <User size={12} aria-hidden="true" />
                        Producción del docente
                    </p>
                    <p className="text-base font-bold text-gray-900 dark:text-white truncate">
                        {nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {loading
                            ? "Cargando productos…"
                            : `${total} producto${total === 1 ? "" : "s"} publicado${total === 1 ? "" : "s"}`}
                    </p>
                </div>
            </div>

            <button
                type="button"
                onClick={onQuitar}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                    text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600
                    hover:border-red-300 hover:text-red-600 transition shrink-0 ${focusRing}`}
            >
                <X size={13} aria-hidden="true" />
                Ver todo el catálogo
            </button>
        </div>
    );
};

export const DocenteEnlace = ({ producto, children, className = "" }) => {
    const url = urlVistaDocente(producto);
    const label = children ?? nombreDocente(producto);

    if (!url) {
        return <span className={className}>{label}</span>;
    }

    return (
        <Link
            to={url}
            className={`hover:text-[#EC7A21] hover:underline transition ${className}`}
            title={`Ver producción de ${nombreDocente(producto)}`}
        >
            {label}
        </Link>
    );
};

export const DocenteEnlacePorNombre = ({ nombre, children, className = "" }) => {
    const url = urlVistaDocentePorNombre(nombre);
    const label = children ?? nombre;

    if (!url) {
        return <span className={className}>{label}</span>;
    }

    return (
        <Link to={url} className={`hover:text-[#EC7A21] hover:underline transition ${className}`}>
            {label}
        </Link>
    );
};
