import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export const usePublicProductoDetalle = (productos = []) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const productoId = searchParams.get("producto") ?? "";

    const previewProducto = useMemo(() => {
        if (!productoId) return null;
        return productos.find((p) => String(p.id) === String(productoId)) ?? null;
    }, [productoId, productos]);

    const abrirDetalle = useCallback((producto) => {
        if (!producto?.id) return;
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("producto", String(producto.id));
            return next;
        });
    }, [setSearchParams]);

    const cerrarDetalle = useCallback(() => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete("producto");
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    return {
        productoId,
        previewProducto,
        detalleAbierto: Boolean(productoId),
        abrirDetalle,
        cerrarDetalle,
    };
};
