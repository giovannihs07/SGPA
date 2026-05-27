import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { getTiposProducto } from "../services/productoServices";
import { CATEGORIA_A_SUBCATEGORIAS } from "../pages/docente/productoConfig";
import { notifyError } from "../utils/notify";
import { INITIAL_PRODUCTO_FORM, buildProductoPayload } from "../pages/docente/components/productoFormUtils";

/**
 * Hook compartido para formulario de producto (crear / editar).
 * @param {object} options
 * @param {object} [options.initialForm] - estado inicial del formulario
 * @param {Function} options.onSubmit - async (payload, archivo) => void
 * @param {boolean} [options.resetOnSuccess=false] - limpiar form tras guardar
 */
export const useProductoForm = ({
    initialForm = INITIAL_PRODUCTO_FORM,
    onSubmit,
    resetOnSuccess = false,
}) => {
    const [tiposMap, setTiposMap]         = useState({});
    const [loadingTipos, setLoadingTipos] = useState(true);
    const [errorTipos, setErrorTipos]     = useState(null);

    useEffect(() => {
        getTiposProducto()
            .then(setTiposMap)
            .catch((e) => setErrorTipos(e.response?.data?.message ?? e.message))
            .finally(() => setLoadingTipos(false));
    }, []);

    const [form, setForm]       = useState(initialForm);
    const [archivo, setArchivo] = useState(null);
    const [loading, setLoading] = useState(false);

    // Sincronizar cuando llega el producto a editar
    useEffect(() => {
        setForm(initialForm);
    }, [initialForm]);

    const { categoria, subcategoria, tipo, atributos } = form;

    const subcategoriasDisponibles = useMemo(() => {
        if (!categoria) return [];
        return CATEGORIA_A_SUBCATEGORIAS[categoria] ?? [];
    }, [categoria]);

    const tiposDisponibles = useMemo(() => {
        if (!subcategoria || !tiposMap[subcategoria]) return [];
        return Object.keys(tiposMap[subcategoria]);
    }, [subcategoria, tiposMap]);

    const atributosRequeridos = useMemo(() => {
        if (!subcategoria || !tipo) return [];
        return tiposMap[subcategoria]?.[tipo] ?? [];
    }, [subcategoria, tipo, tiposMap]);

    const handleChange = useCallback(({ target: { name, value } }) => {
        setForm((prev) => {
            if (name === "categoria")    return { ...prev, categoria: value, subcategoria: "", tipo: "", atributos: {} };
            if (name === "subcategoria") return { ...prev, subcategoria: value, tipo: "", atributos: {} };
            if (name === "tipo")         return { ...prev, tipo: value, atributos: {} };
            return { ...prev, [name]: value };
        });
    }, []);

    const handleAtributoChange = useCallback(({ target: { name, value } }) => {
        setForm((prev) => ({
            ...prev,
            atributos: { ...prev.atributos, [name]: value },
        }));
    }, []);

    const handleArchivoChange = useCallback((e) => {
        setArchivo(e.target.files?.[0] ?? null);
    }, []);

    const removeArchivo = useCallback(() => setArchivo(null), []);

    const isValid = useMemo(() => {
        if (!form.nombre.trim() || !form.descripcion.trim()) return false;
        if (!categoria || !subcategoria || !tipo)            return false;
        return atributosRequeridos.every(
            (attr) => String(atributos[attr] ?? "").trim() !== "",
        );
    }, [form, categoria, subcategoria, tipo, atributosRequeridos, atributos]);

    const submittingRef = useRef(false);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!isValid || submittingRef.current) return;

        submittingRef.current = true;
        setLoading(true);

        try {
            await onSubmit(buildProductoPayload(form, tipo), archivo);
            if (resetOnSuccess) {
                setForm(INITIAL_PRODUCTO_FORM);
                setArchivo(null);
            }
        } catch (err) {
            notifyError(
                "Error al guardar",
                err.response?.data?.error
                    ?? err.response?.data?.message
                    ?? err.message
                    ?? "No se pudo guardar el producto",
            );
        } finally {
            setLoading(false);
            submittingRef.current = false;
        }
    }, [form, tipo, archivo, isValid, onSubmit, resetOnSuccess]);

    return {
        loadingTipos, errorTipos,
        subcategoriasDisponibles, tiposDisponibles, atributosRequeridos,
        form, archivo, loading, isValid,
        handleChange, handleAtributoChange,
        handleArchivoChange, removeArchivo,
        handleSubmit,
    };
};
