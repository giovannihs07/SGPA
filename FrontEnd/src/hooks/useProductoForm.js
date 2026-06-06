import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { getProductoSchema } from "../services/productoServices";
import { notifyError } from "../utils/notify";
import { getApiErrorMessage } from "../utils/apiError";
import {
    MAX_ARCHIVO_BYTES,
    MAX_ARCHIVOS,
    ROL_PRINCIPAL,
    mensajeArchivoExcedeLimite,
    esExtensionPermitida,
    mensajeExtensionNoPermitida,
    crearEntradaArchivoNuevo,
    tieneArchivoPrincipal,
    totalArchivosActivos,
} from "../config/productoArchivo";
import {
    INITIAL_PRODUCTO_FORM,
    buildProductoPayload,
    resolveFormFromProduct,
    findCategoria,
    findSubcategoria,
    getAtributosDelTipo,
} from "../pages/docente/components/productoFormUtils";

/** Referencia estable para evitar re-renders infinitos con el valor por defecto []. */
export const ARCHIVOS_GUARDADOS_VACIOS = [];

export const useProductoForm = ({
    initialForm = INITIAL_PRODUCTO_FORM,
    archivosGuardadosIniciales = ARCHIVOS_GUARDADOS_VACIOS,
    esEdicion = false,
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

    const [form, setForm] = useState(initialForm);
    const [archivosNuevos, setArchivosNuevos] = useState([]);
    const [archivosGuardados, setArchivosGuardados] = useState(archivosGuardadosIniciales);
    const [archivosEliminarIds, setArchivosEliminarIds] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm(resolveFormFromProduct(initialForm, schema));
    }, [initialForm, schema]);

    useEffect(() => {
        if (!esEdicion) return;
        setArchivosGuardados(archivosGuardadosIniciales);
        setArchivosNuevos([]);
        setArchivosEliminarIds([]);
    }, [esEdicion, archivosGuardadosIniciales]);

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

    const archivosValidos = useMemo(
        () => tieneArchivoPrincipal(archivosGuardados, archivosNuevos, archivosEliminarIds),
        [archivosGuardados, archivosNuevos, archivosEliminarIds],
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

    const handleAgregarArchivo = useCallback((e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (!file) return;

        if (!esExtensionPermitida(file.name)) {
            notifyError("Tipo de archivo no permitido", mensajeExtensionNoPermitida(file.name));
            return;
        }
        if (file.size > MAX_ARCHIVO_BYTES) {
            notifyError("Archivo demasiado grande", mensajeArchivoExcedeLimite(file.size));
            return;
        }
        if (totalArchivosActivos(archivosGuardados, archivosNuevos, archivosEliminarIds) >= MAX_ARCHIVOS) {
            notifyError("Límite alcanzado", `Máximo ${MAX_ARCHIVOS} archivos por producto.`);
            return;
        }

        const hayPrincipal = tieneArchivoPrincipal(
            archivosGuardados, archivosNuevos, archivosEliminarIds,
        );
        const rol = hayPrincipal ? "ANEXO" : ROL_PRINCIPAL;
        const orden = totalArchivosActivos(archivosGuardados, archivosNuevos, archivosEliminarIds) + 1;

        setArchivosNuevos((prev) => [...prev, crearEntradaArchivoNuevo(file, rol, orden)]);
    }, [archivosGuardados, archivosNuevos, archivosEliminarIds]);

    const quitarArchivoNuevo = useCallback((localId) => {
        setArchivosNuevos((prev) => prev.filter((a) => a.localId !== localId));
    }, []);

    const cambiarRolArchivoNuevo = useCallback((localId, rol) => {
        if (rol === ROL_PRINCIPAL) {
            const yaHayPrincipal = tieneArchivoPrincipal(
                archivosGuardados,
                archivosNuevos.filter((a) => a.localId !== localId),
                archivosEliminarIds,
            );
            if (yaHayPrincipal) {
                notifyError("Rol no permitido", "Ya existe un archivo Principal.");
                return;
            }
        }
        setArchivosNuevos((prev) =>
            prev.map((a) => (a.localId === localId ? { ...a, rol } : a)),
        );
    }, [archivosGuardados, archivosNuevos, archivosEliminarIds]);

    const quitarArchivoGuardado = useCallback((id) => {
        setArchivosEliminarIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }, []);

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
        if (!archivosValidos) return false;
        const atributosOk = atributosDef
            .filter((a) => a.requerido)
            .every((a) => atributoTieneValor(a, atributos));
        return atributosOk;
    }, [form, categoriaId, subcategoriaId, tipoProductoId, atributosDef, atributos, atributoTieneValor, archivosValidos]);

    const submittingRef = useRef(false);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!isValid || submittingRef.current) return;

        if (!archivosValidos) {
            notifyError("Archivo obligatorio", "Debes adjuntar un archivo con rol Principal.");
            return;
        }

        for (const a of archivosNuevos) {
            if (a.file.size > MAX_ARCHIVO_BYTES) {
                notifyError("Archivo demasiado grande", mensajeArchivoExcedeLimite(a.file.size));
                return;
            }
        }

        submittingRef.current = true;
        setLoading(true);

        try {
            const payload = buildProductoPayload(form, { archivosNuevos, archivosEliminarIds });
            const files = archivosNuevos.map((a) => a.file);
            await onSubmit(payload, files);
            if (resetOnSuccess) {
                setForm(INITIAL_PRODUCTO_FORM);
                setArchivosNuevos([]);
                setArchivosGuardados([]);
                setArchivosEliminarIds([]);
            }
        } catch (err) {
            notifyError(
                "Error al guardar",
                getApiErrorMessage(err, "No se pudo guardar el producto"),
            );
        } finally {
            setLoading(false);
            submittingRef.current = false;
        }
    }, [form, archivosNuevos, archivosEliminarIds, isValid, archivosValidos, onSubmit, resetOnSuccess]);

    return {
        loadingTipos: loadingSchema,
        errorTipos: errorSchema,
        schema,
        categoriasDisponibles,
        subcategoriasDisponibles,
        tiposDisponibles,
        atributosDef,
        form,
        archivosNuevos,
        archivosGuardados,
        archivosEliminarIds,
        esEdicion,
        loading,
        isValid,
        handleChange,
        handleAtributoChange,
        handleAgregarArchivo,
        quitarArchivoNuevo,
        cambiarRolArchivoNuevo,
        quitarArchivoGuardado,
        handleSubmit,
    };
};
