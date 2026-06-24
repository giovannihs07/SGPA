import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getMisProductos,
    descargarArchivo,
    descargarArchivoProducto,
    publicarProducto,
    despublicarProducto,
    eliminarProducto,
} from "../services/productoServices";
import { getMiPerfilDocente } from "../services/docenteService";
import {
    esReciente,
    parseFechaLocal,
    obtenerArchivosProducto,
} from "../pages/docente/components/productoHelpers";
import { notifySuccess, notifyError } from "../utils/notify";
import {
    intentarEliminarProducto,
    confirmPublicarProducto,
    confirmDespublicarProducto,
} from "../pages/docente/components/misProductos/productoSwal";

const LIMITE_RECIENTES = 5;

export const nombreDocente = (docente) => {
    if (!docente) return null;
    const nombre = [docente.nombre, docente.apellido].filter(Boolean).join(" ").trim();
    return nombre || null;
};

export const useDocenteDashboard = () => {
    const [productos, setProductos] = useState([]);
    const [docente, setDocente]     = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [toggling, setToggling]   = useState(null);
    const [productoDetalle, setProductoDetalle] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [misProductos, perfil] = await Promise.all([
                getMisProductos(),
                getMiPerfilDocente(),
            ]);
            setProductos(misProductos);
            setDocente(perfil);
        } catch (e) {
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "Error al cargar el dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const resumen = useMemo(() => ({
        total:         productos.length,
        publicados:    productos.filter((p) => p.publicado).length,
        sinPublicar:   productos.filter((p) => !p.publicado).length,
        ultimos30Dias: productos.filter((p) => esReciente(p.fechaRegistroSgpa)).length,
    }), [productos]);

    const recientes = useMemo(() =>
        [...productos]
            .sort((a, b) =>
                (parseFechaLocal(b.fechaRegistroSgpa)?.getTime() ?? 0)
                - (parseFechaLocal(a.fechaRegistroSgpa)?.getTime() ?? 0))
            .slice(0, LIMITE_RECIENTES),
    [productos]);

    const abrirDetalle = useCallback((producto) => {
        setProductoDetalle(producto);
    }, []);

    const cerrarDetalle = useCallback(() => {
        setProductoDetalle(null);
    }, []);

    const handleDescargar = useCallback(async (producto, archivo = null) => {
        const lista = obtenerArchivosProducto(producto);
        const target = archivo ?? lista.find((a) => a.rol === "PRINCIPAL") ?? lista[0];
        if (!target) {
            notifyError("Sin archivo", "Este producto no tiene archivos adjuntos.");
            return;
        }
        try {
            if (target.id) {
                await descargarArchivoProducto(producto.id, target.id, target.nombreOriginal);
            } else {
                await descargarArchivo(producto.id, target.nombreOriginal);
            }
        } catch (e) {
            notifyError("Error", e.message ?? "No se pudo descargar el archivo");
        }
    }, []);

    const togglePublicacion = useCallback(async (producto) => {
        let visibilidad = null;
        if (producto.publicado) {
            const ok = await confirmDespublicarProducto(producto);
            if (!ok) return;
        } else {
            visibilidad = await confirmPublicarProducto(producto);
            if (!visibilidad) return;
        }

        setToggling(producto.id);
        try {
            const data = producto.publicado
                ? await despublicarProducto(producto.id)
                : await publicarProducto(producto.id, visibilidad);
            setProductos((prev) => prev.map((p) => (p.id === producto.id ? data : p)));
            setProductoDetalle((prev) => (prev?.id === data.id ? data : prev));
            notifySuccess(
                producto.publicado ? "Producto despublicado" : "Producto publicado",
                producto.publicado
                    ? `"${producto.nombre}" fue actualizado.`
                    : `"${producto.nombre}" ya está publicado en SGPA.`,
            );
        } catch (e) {
            notifyError(
                "Error",
                e.response?.data?.error
                    ?? e.response?.data?.message
                    ?? e.message
                    ?? "No se pudo actualizar el estado",
            );
        } finally {
            setToggling(null);
        }
    }, []);

    const eliminarProductoHandler = useCallback(async (producto) => {
        const ok = await intentarEliminarProducto(producto);
        if (!ok) return;
        try {
            await eliminarProducto(producto.id);
            setProductos((prev) => prev.filter((p) => p.id !== producto.id));
            setProductoDetalle((prev) => (prev?.id === producto.id ? null : prev));
            notifySuccess("Producto eliminado", `"${producto.nombre}" fue eliminado.`);
        } catch (e) {
            notifyError(
                "Error",
                e.response?.data?.error
                    ?? e.response?.data?.message
                    ?? "No se pudo eliminar el producto",
            );
        }
    }, []);

    const toggleFromDetalle = useCallback(async () => {
        if (!productoDetalle) return;
        await togglePublicacion(productoDetalle);
    }, [productoDetalle, togglePublicacion]);

    const eliminarFromDetalle = useCallback(async () => {
        if (!productoDetalle) return;
        const producto = productoDetalle;
        cerrarDetalle();
        await eliminarProductoHandler(producto);
    }, [productoDetalle, cerrarDetalle, eliminarProductoHandler]);

    const porCategoria = useMemo(() => {
        const conteo = productos.reduce((acc, p) => {
            const cat = p.categoria ?? "SIN_CATEGORIA";
            acc[cat] = (acc[cat] ?? 0) + 1;
            return acc;
        }, {});
        return Object.entries(conteo)
            .map(([categoria, total]) => ({ categoria, total }))
            .sort((a, b) => b.total - a.total);
    }, [productos]);

    return {
        docente,
        nombreDocente: nombreDocente(docente),
        productos,
        resumen,
        recientes,
        porCategoria,
        loading,
        error,
        refetch: fetchData,
        productoDetalle,
        abrirDetalle,
        cerrarDetalle,
        toggling,
        toggleFromDetalle,
        eliminarFromDetalle,
        handleDescargar,
    };
};
