import { Link } from "react-router-dom";
import { Lock, ArrowLeft, Globe } from "lucide-react";
import { MENSAJE_EDICION_BLOQUEADA } from "../productoHelpers";

export const ProductoEdicionBloqueada = ({ producto }) => (
    <div className="max-w-lg mx-auto min-h-[50vh] flex flex-col items-center justify-center px-4">
        <div className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100
            dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="h-1.5 bg-linear-to-r from-[#ffc20e] via-[#EFB357] to-[#EC7A21]" />

            <div className="p-8 text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20
                    flex items-center justify-center">
                    <Lock size={26} className="text-[#EC7A21]" />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                        Edición no disponible
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                        {MENSAJE_EDICION_BLOQUEADA}
                    </p>
                </div>

                {producto?.nombre && (
                    <p className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-900/50
                        rounded-lg px-3 py-2 inline-block">
                        {producto.nombre}
                    </p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                        to="/dashboard/docente/productos"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold
                            text-[#EC7A21] hover:underline"
                    >
                        <ArrowLeft size={14} /> Volver a Mis productos
                    </Link>
                    <span className="hidden sm:inline text-gray-300">|</span>
                    <p className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                        <Globe size={12} className="text-green-600" />
                        Despublica el producto desde la tabla o el detalle
                    </p>
                </div>
            </div>
        </div>
    </div>
);
