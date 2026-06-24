import { Link } from "react-router-dom";
import { ArrowLeft, FilePlus } from "lucide-react";
import { useRegistrarProducto } from "../../hooks/useRegistrarProducto";
import { ProductoForm } from "./components/ProductoForm";
import { RegistrarProductoGuia } from "./components/RegistrarProductoGuia";

export const RegistrarProductoPage = () => {
    const hook = useRegistrarProducto();

    return (
        <div className="max-w-3xl mx-auto space-y-5">
            <Link
                to="/dashboard/docente/productos"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500
                    hover:text-[#EC7A21] transition"
            >
                <ArrowLeft size={14} />
                Mis productos
            </Link>

            <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <FilePlus size={20} className="text-[#EC7A21]" aria-hidden="true" />
                    Registrar producto académico
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Documenta tu producción en SGPA para reportes, autoevaluación y visibilidad institucional.
                </p>
            </div>

            <RegistrarProductoGuia />

            <ProductoForm
                {...hook}
                submitLabel="Registrar producto"
                loadingLabel="Registrando…"
            />
        </div>
    );
};
