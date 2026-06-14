import { FileText } from "lucide-react";
import { ProductoPublicoCard } from "./ProductoPublicoCard";
import { ProductosPaginacion } from "../../docente/components/misProductos/ProductosPaginacion";
import { card } from "../../../components/ui/themeTokens";

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
            <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {productos.map((p) => (
                    <ProductoPublicoCard
                        key={p.id}
                        producto={p}
                        onVer={onVer}
                        onDescargar={onDescargar}
                    />
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
