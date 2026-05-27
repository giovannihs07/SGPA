import { useCallback } from "react";
import { crearProducto } from "../services/productoServices";
import { notifySuccess } from "../utils/notify";
import { useProductoForm } from "./useProductoForm";

export const useRegistrarProducto = () => {
    const onSubmit = useCallback(async (payload, archivo) => {
        await crearProducto(payload, archivo);
        await notifySuccess(
            "¡Producto registrado!",
            "Quedó en estado Sin publicar, pendiente de revisión.",
        );
    }, []);

    return useProductoForm({ onSubmit, resetOnSuccess: true });
};
