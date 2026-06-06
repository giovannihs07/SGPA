import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMiProductoPorId, actualizarMiProducto } from "../services/productoServices";
import { notifySuccess } from "../utils/notify";
import { useProductoForm, ARCHIVOS_GUARDADOS_VACIOS } from "./useProductoForm";
import { productoToForm, INITIAL_PRODUCTO_FORM } from "../pages/docente/components/productoFormUtils";
import { puedeEditarProducto } from "../pages/docente/components/productoHelpers";

export const useEditarProducto = (productoId) => {
    const navigate = useNavigate();
    const [loadingProducto, setLoadingProducto] = useState(true);
    const [errorProducto, setErrorProducto]     = useState(null);
    const [producto, setProducto]               = useState(null);
    const [initialForm, setInitialForm]         = useState(INITIAL_PRODUCTO_FORM);

    useEffect(() => {
        if (!productoId) return;
        setLoadingProducto(true);
        setErrorProducto(null);

        getMiProductoPorId(productoId)
            .then((data) => {
                setProducto(data);
                setInitialForm(productoToForm(data));
            })
            .catch((e) => {
                setErrorProducto(
                    e.response?.data?.error
                        ?? e.response?.data?.message
                        ?? e.message
                        ?? "No se pudo cargar el producto",
                );
            })
            .finally(() => setLoadingProducto(false));
    }, [productoId]);

    const archivosGuardadosIniciales = useMemo(
        () => producto?.archivos ?? ARCHIVOS_GUARDADOS_VACIOS,
        [producto],
    );

    const onSubmit = useCallback(async (payload, archivos) => {
        await actualizarMiProducto(productoId, payload, archivos);
        await notifySuccess("Producto actualizado", "Los cambios se guardaron correctamente.");
        navigate("/dashboard/docente/productos");
    }, [productoId, navigate]);

    const formHook = useProductoForm({
        initialForm,
        archivosGuardadosIniciales,
        esEdicion: true,
        onSubmit,
    });

    return {
        ...formHook,
        loadingProducto,
        errorProducto,
        producto,
        esEditable: producto ? puedeEditarProducto(producto) : false,
    };
};
