import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { getProductoSchema } from "../services/productoServices";
import { notifyError } from "../utils/notify";
import {
    INITIAL_PRODUCTO_FORM,
    buildProductoPayload,
    resolveFormFromProduct,
    findCategoria,
    findSubcategoria,
    getAtributosDelTipo,
} from "../pages/docente/components/productoFormUtils";

/**
 * Hook compartido para formulario de producto (crear / editar).
 */
export const useProductoForm = ({
    initialForm = INITIAL_PRODUCTO_FORM,
    onSubmit,
    resetOnSuccess = false,
}) => {
    const [schema, setSchema]           = useState([]);
    const [loadingSchema, setLoadingSchema] = useState(true);
    const [errorSchema, setErrorSchema] = useState(null);

    useEffect(() => {
        getProductoSchema()
            .then(setSchema)
            .catch((e) => setErrorSchema(
                e.response?.data?.error ?? e.message ?? "No se pudo cargar la taxonomía",
            ))
            .finally(() => setLoadingSchema(false));
    }, []);

    const [form, setForm]       = useState(initialForm);
    const [archivo, setArchivo] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm(resolveFormFromProduct(initialForm, schema));
    }, [initialForm, schema]);

    const { categoriaId, subcategoriaId, tipoProductoId, atributos } = form;

    const categoriasDisponibles = useMemo(
        () => schema.map((c) => ({ id: c.id, nombre: c.nombre })),
        [schema],
    );

    const subcategoriasDisponibles = useMemo(() => {
        if (!categoriaId) return [];
        const cat = findCategoria(schema, categoriaId);
        return (cat?.subcategorias ?? []).map((s) => ({ id: s.id, nombre: s.nombre }));
    }, [schema, categoriaId]);

    const tiposDisponibles = useMemo(() => {
        if (!categoriaId || !subcategoriaId) return [];
        const sub = findSubcategoria(schema, categoriaId, subcategoriaId);
        return (sub?.tipos ?? []).map((t) => ({ id: t.id, nombre: t.nombre }));
    }, [schema, categoriaId, subcategoriaId]);

    const atributosDef = useMemo(
        () => getAtributosDelTipo(schema, categoriaId, subcategoriaId, tipoProductoId),
        [schema, categoriaId, subcategoriaId, tipoProductoId],
    );

    const handleChange = useCallback(({ target: { name, value } }) => {
        setForm((prev) => {
            if (name === "categoriaId") {
                return {
                    ...prev,
                    categoriaId: value,
                    subcategoriaId: "",
                    tipoProductoId: "",
                    atributos: {},
                };
            }
            if (name === "subcategoriaId") {
                return {
                    ...prev,
                    subcategoriaId: value,
                    tipoProductoId: "",
                    atributos: {},
                };
            }
            if (name === "tipoProductoId") {
                return { ...prev, tipoProductoId: value, atributos: {} };
            }
            return { ...prev, [name]: value };
        });
    }, []);

    const handleAtributoChange = useCallback(({ target: { name, value, type, checked } }) => {
        const parsed = type === "checkbox" ? checked : value;
        setForm((prev) => ({
            ...prev,
            atributos: { ...prev.atributos, [name]: parsed },
        }));
    }, []);

    const handleArchivoChange = useCallback((e) => {
        setArchivo(e.target.files?.[0] ?? null);
    }, []);

    const removeArchivo = useCallback(() => setArchivo(null), []);

    const atributoTieneValor = useCallback((def, valores) => {
        const v = valores[def.nombreAtributo];
        if (def.tipoDato === "BOOLEAN") {
            return v === true || v === "true";
        }
        return String(v ?? "").trim() !== "";
    }, []);

    const isValid = useMemo(() => {
        if (!form.nombre.trim() || !form.descripcion.trim()) return false;
        if (!categoriaId || !subcategoriaId || !tipoProductoId) return false;
        return atributosDef
            .filter((a) => a.requerido)
            .every((a) => atributoTieneValor(a, atributos));
    }, [form, categoriaId, subcategoriaId, tipoProductoId, atributosDef, atributos, atributoTieneValor]);

    const submittingRef = useRef(false);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!isValid || submittingRef.current) return;

        submittingRef.current = true;
        setLoading(true);

        try {
            await onSubmit(buildProductoPayload(form), archivo);
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
    }, [form, archivo, isValid, onSubmit, resetOnSuccess]);

    return {
        loadingTipos: loadingSchema,
        errorTipos: errorSchema,
        schema,
        categoriasDisponibles,
        subcategoriasDisponibles,
        tiposDisponibles,
        atributosDef,
        form,
        archivo,
        loading,
        isValid,
        handleChange,
        handleAtributoChange,
        handleArchivoChange,
        removeArchivo,
        handleSubmit,
    };
};
