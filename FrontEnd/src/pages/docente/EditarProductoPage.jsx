import { useParams, useNavigate, Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useEditarProducto } from "../../hooks/useEditarProducto";
import { ProductoForm } from "./components/ProductoForm";
import { ProductoEdicionBloqueada } from "./components/misProductos/ProductoEdicionBloqueada";

export const EditarProductoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const hook = useEditarProducto(id);

    if (hook.loadingProducto) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3 text-gray-400">
                <div className="w-8 h-8 border-2 border-[#EFB357] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Cargando producto…</span>
            </div>
        </div>
    );

    if (hook.errorProducto) return (
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 min-h-[50vh] justify-center">
            <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg text-sm">
                <AlertCircle size={16} />
                {hook.errorProducto}
            </div>
            <button
                onClick={() => navigate("/dashboard/docente/productos")}
                className="text-xs text-[#EC7A21] hover:underline flex items-center gap-1"
            >
                <ArrowLeft size={12} /> Volver a Mis productos
            </button>
        </div>
    );

    if (hook.producto && !hook.esEditable) {
        return <ProductoEdicionBloqueada producto={hook.producto} />;
    }

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <Link
                to="/dashboard/docente/productos"
                className="inline-flex items-center gap-1.5 text-xs text-gray-500
                    hover:text-[#EC7A21] transition"
            >
                <ArrowLeft size={14} /> Mis productos
            </Link>

            <ProductoForm
                {...hook}
                submitLabel="Guardar cambios"
                loadingLabel="Guardando…"
            />
        </div>
    );
};
