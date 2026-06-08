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

/** Estado inicial de los archivos guardados. */
export const ARCHIVOS_GUARDADOS_VACIOS = [];

/** Hook para el formulario de producto. */
export const useProductoForm = ({
    initialForm = INITIAL_PRODUCTO_FORM,
    archivosGuardadosIniciales = ARCHIVOS_GUARDADOS_VACIOS,
    esEdicion = false,
    onSubmit,
    resetOnSuccess = false,
}) => {
    const [schema, setSchema] = useState([]); // Taxonomía de productos.
    const [loadingSchema, setLoadingSchema] = useState(true); // Indica si la taxonomía está cargando.
    const [errorSchema, setErrorSchema] = useState(null); // Error al cargar la taxonomía.

    /** Carga la taxonomía de productos. */
    useEffect(() => {
        getProductoSchema()
            .then(setSchema)
            .catch((e) => setErrorSchema(
                e.response?.data?.error ?? e.message ?? "No se pudo cargar la taxonomía",
            ))
            .finally(() => setLoadingSchema(false));
    }, []);

    /** Estados del formulario de producto. */
    const [form, setForm] = useState(initialForm); // Formulario de producto.
    const [archivosNuevos, setArchivosNuevos] = useState([]); // Archivos nuevos.
    const [archivosGuardados, setArchivosGuardados] = useState(archivosGuardadosIniciales); // Archivos guardados.
    const [archivosEliminarIds, setArchivosEliminarIds] = useState([]); // IDs de archivos a eliminar.
    const [loading, setLoading] = useState(false); // Indica si el formulario está cargando.

    /** Resuelve el formulario de producto desde el producto. */
    useEffect(() => {
        setForm(resolveFormFromProduct(initialForm, schema));
    }, [initialForm, schema]);

    /** Reinicia los archivos guardados y nuevos cuando es edición. */
    useEffect(() => {
        if (!esEdicion) return;
        setArchivosGuardados(archivosGuardadosIniciales);
        setArchivosNuevos([]);
        setArchivosEliminarIds([]);
    }, [esEdicion, archivosGuardadosIniciales]);

    /** Se obtienen los IDs de la categoría, subcategoría y tipo de producto. */
    const { categoriaId, subcategoriaId, tipoProductoId, atributos } = form;

    /** Categorías de productos disponibles. */
    const categoriasDisponibles = useMemo(
        () => schema.map((c) => ({ id: c.id, nombre: c.nombre })),
        [schema],
    );

    /** Subcategorías de productos disponibles. */
    const subcategoriasDisponibles = useMemo(() => {
        if (!categoriaId) return [];
        const cat = findCategoria(schema, categoriaId);
        return (cat?.subcategorias ?? []).map((s) => ({ id: s.id, nombre: s.nombre }));
    }, [schema, categoriaId]);

    /** Tipos de productos disponibles. */
    const tiposDisponibles = useMemo(() => {
        if (!categoriaId || !subcategoriaId) return [];
        const sub = findSubcategoria(schema, categoriaId, subcategoriaId);
        return (sub?.tipos ?? []).map((t) => ({ id: t.id, nombre: t.nombre }));
    }, [schema, categoriaId, subcategoriaId]);

    /** Atributos definidos del tipo de producto. */
    const atributosDef = useMemo(
        () => getAtributosDelTipo(schema, categoriaId, subcategoriaId, tipoProductoId),
        [schema, categoriaId, subcategoriaId, tipoProductoId],
    );

    /** Se indica si los archivos del producto son válidos. */
    const archivosValidos = useMemo(
        () => tieneArchivoPrincipal(archivosGuardados, archivosNuevos, archivosEliminarIds),
        [archivosGuardados, archivosNuevos, archivosEliminarIds],
    );

    /** Maneja el cambio de los campos del formulario de producto. */
    const handleChange = useCallback(({ target: { name, value } }) => {
        setForm((prev) => {
            if (name === "categoriaId") { 
                // Si se cambia la categoría, se reinician la subcategoría y el tipo de producto.
                return {
                    ...prev,
                    categoriaId: value,
                    subcategoriaId: "",
                    tipoProductoId: "",
                    atributos: {},
                };
            }
            if (name === "subcategoriaId") {
                // Si se cambia la subcategoría, se reinicia el tipo de producto.
                return {
                    ...prev,
                    subcategoriaId: value,
                    tipoProductoId: "",
                    atributos: {},
                };
            }
            if (name === "tipoProductoId") {
                // Si se cambia el tipo de producto, se reinician los atributos.
                return { ...prev, tipoProductoId: value, atributos: {} };
            }
            return { ...prev, [name]: value };
        });
    }, []);

    /** Se maneja el cambio de los atributos del formulario de producto. */
    const handleAtributoChange = useCallback(({ target: { name, value, type, checked } }) => {
        const parsed = type === "checkbox" ? checked : value;
        setForm((prev) => ({
            ...prev,
            atributos: { ...prev.atributos, [name]: parsed },
        }));
    }, []);

    /** Se maneja la adición de un nuevo archivo al formulario de producto. */
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

    /** Se maneja la eliminación de un archivo nuevo. */
    const quitarArchivoNuevo = useCallback((localId) => {
        setArchivosNuevos((prev) => prev.filter((a) => a.localId !== localId));
    }, []);

    /** Cambio de rol de un archivo nuevo. */
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

    /** Eliminación de un archivo guardado. */
    const quitarArchivoGuardado = useCallback((id) => {
        setArchivosEliminarIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }, []);

    /** Se verifica si un atributo tiene un valor válido. */
    const atributoTieneValor = useCallback((def, valores) => {
        const v = valores[def.nombreAtributo];
        if (def.tipoDato === "BOOLEAN") {
            return v === true || v === "true";
        }
        return String(v ?? "").trim() !== "";
    }, []);

    /** Se indica si el formulario de producto es válido. */
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

    /** Se maneja el envío del formulario de producto. */
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

    /** Se retornan los valores del formulario de producto. */
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
