// lógica del formulario en cascada

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { getTiposProducto, crearProducto } from "../services/productoServices";
import { CATEGORIA_A_SUBCATEGORIAS } from "../pages/docente/productoConfig";
import { notifySuccess, notifyError } from "../utils/notify";

const INITIAL_FORM = {
    nombre:      "",
    descripcion: "",
    categoria:   "",
    subcategoria: "",
    tipo:        "",
    atributos:   {},
};

export const useRegistrarProducto = () => {

    // Taxonomía del backend: { SUBCATEGORIA: { TIPO: [attrs] } }
    const [tiposMap, setTiposMap]         = useState({});
    const [loadingTipos, setLoadingTipos] = useState(true);
    const [errorTipos, setErrorTipos]     = useState(null);

    useEffect(() => {
        getTiposProducto()
            .then(setTiposMap)
            .catch((e) => setErrorTipos(e.response?.data?.message ?? e.message))
            .finally(() => setLoadingTipos(false));
    }, []);

    const [form, setForm]       = useState(INITIAL_FORM);
    const [archivo, setArchivo] = useState(null);
    const [loading, setLoading] = useState(false);

    const { categoria, subcategoria, tipo, atributos } = form;

    // Opciones derivadas (selección en cascada)
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

    // Handlers
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

    // Validación dinámica
    const isValid = useMemo(() => {
        if (!form.nombre.trim() || !form.descripcion.trim()) return false;
        if (!categoria || !subcategoria || !tipo)            return false;
        return atributosRequeridos.every(
            (attr) => String(atributos[attr] ?? "").trim() !== ""
        );
    }, [form, categoria, subcategoria, tipo, atributosRequeridos, atributos]);

    const submittingRef = useRef(false);
    // Submit
    // El backend solo necesita: nombre, tipo, descripcion, atributos
    // categoria y subcategoria los deriva internamente del enum TipoProducto 
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!isValid) return;
        if (submittingRef.current) return;
        submittingRef.current = true; 

        setLoading(true);

        const payload = {
            nombre:      form.nombre.trim(),
            descripcion: form.descripcion.trim(),
            tipo,
            atributos,
        };

        console.log("Payload:", JSON.stringify(payload, null, 2));
        try {
            await crearProducto(payload, archivo);
            setForm(INITIAL_FORM);
            setArchivo(null);
            await notifySuccess(
                "¡Producto registrado!",
                "Quedó en estado Sin publicar, pendiente de revisión."
            );
        } catch (err) {
            console.log("Error 400:", err?.response?.data);
            console.log("Status:", err?.response?.status);
            console.log("Data:", err?.response?.data);
            console.log("Headers:", err?.response?.headers);
            notifyError(
                "Error al registrar",
                err.response?.data?.message ?? err.message ?? "Error al registrar el producto"
            );
        } finally {
            setLoading(false);
            submittingRef.current = false;
        }
    }, [form, tipo, atributos, archivo, isValid]);

    return {
        loadingTipos, errorTipos,
        subcategoriasDisponibles, tiposDisponibles, atributosRequeridos,
        form, archivo, loading, isValid,
        handleChange, handleAtributoChange,
        handleArchivoChange, removeArchivo,
        handleSubmit,
    };
};
