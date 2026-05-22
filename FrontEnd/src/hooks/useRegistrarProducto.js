// lógica del formulario en cascada

import { useState, useEffect, useMemo, useCallback } from "react";
import { getTiposProducto, crearProducto } from "../services/productoServices";
import { CATEGORIA_A_SUBCATEGORIAS } from "../pages/docente/productoConfig";

const INITIAL_FORM = {
    nombre: "",
    descripcion: "",
    categoria: "",
    subcategoria: "",
    tipo: "",
    atributos: {},
};

export const useRegistrarProducto = () => {
 
    // Taxonomía del backend: se carga al montar el hook y se mantiene en estado local
    const [tiposMap, setTiposMap]         = useState({});   // { SUB: { TIPO: [attrs] } }
    const [loadingTipos, setLoadingTipos] = useState(true);
    const [errorTipos, setErrorTipos]     = useState(null);
 
    useEffect(() => {
        setLoadingTipos(true);
        getTiposProducto()
            .then(setTiposMap)
            .catch((e) => setErrorTipos(e.response?.data?.message ?? e.message))
            .finally(() => setLoadingTipos(false));
    }, []);
 
    // Estado del formulario
    const [form, setForm]       = useState(INITIAL_FORM);
    const [archivo, setArchivo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError]     = useState(null);
 
    const { categoria, subcategoria, tipo, atributos } = form;
 
    // Opciones derivadas del fromulario (selección en cascada)
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
 
    // Handlers de formulario
    const handleChange = useCallback(({ target: { name, value } }) => {
        setForm((prev) => {
            // Cada nivel limpia los niveles inferiores
            if (name === "categoria")    return { ...INITIAL_FORM, categoria: value };
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
 
    // Validación dinámica basada en los campos requeridos por el tipo seleccionado
    const isValid = useMemo(() => {
        if (!form.nombre.trim() || !form.descripcion.trim()) return false;
        if (!categoria || !subcategoria || !tipo)            return false;
        return atributosRequeridos.every(
            (attr) => String(atributos[attr] ?? "").trim() !== ""
        );
    }, [form, categoria, subcategoria, tipo, atributosRequeridos, atributos]);
 
    // Submit del formulario
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!isValid) return;
 
        setLoading(true);
        setError(null);
        setSuccess(false);
 
        const payload = {
            nombre:       form.nombre.trim(),
            descripcion:  form.descripcion.trim(),
            categoria,
            subcategoria,
            tipo,
            atributos,
        };
 
        try {
            await crearProducto(payload, archivo);
            setSuccess(true);
            setForm(INITIAL_FORM);
            setArchivo(null);
        } catch (err) {
            setError(err.response?.data?.message ?? err.message ?? "Error al registrar el producto");
        } finally {
            setLoading(false);
        }
    }, [form, categoria, subcategoria, tipo, atributos, archivo, isValid]);
 
    const resetSuccess = useCallback(() => setSuccess(false), []);
    const resetError   = useCallback(() => setError(null), []);
 
    return {
        loadingTipos, errorTipos,
        subcategoriasDisponibles, tiposDisponibles, atributosRequeridos,
        form, archivo, loading, success, error, isValid,
        handleChange, handleAtributoChange,
        handleArchivoChange, removeArchivo,
        handleSubmit, resetSuccess, resetError,
    };
};