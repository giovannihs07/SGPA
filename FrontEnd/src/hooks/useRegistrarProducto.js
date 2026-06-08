import { useCallback } from "react";
import { crearProducto } from "../services/productoServices";
import { notifySuccess } from "../utils/notify";
import { useProductoForm } from "./useProductoForm";

export const useRegistrarProducto = () => {
    const onSubmit = useCallback(async (payload, archivos) => {
        await crearProducto(payload, archivos);
        await notifySuccess(
            "¡Producto registrado!",
            "Quedó en estado Sin publicar.",
        );
    }, []);

    return useProductoForm({ onSubmit, resetOnSuccess: true });
};
