import { useState, useEffect, useMemo, useCallback } from "react";
import {
    getMisProductos,
    eliminarProducto,
    descargarArchivo,
    descargarArchivoProducto,
    publicarProducto,
    despublicarProducto,
} from "../services/productoServices";
import { obtenerArchivosProducto } from "../pages/docente/components/productoHelpers";
import { notifySuccess, notifyError } from "../utils/notify";
import { esReciente } from "../pages/docente/components/productoHelpers";
import {
    intentarEliminarProducto,
    confirmPublicarProducto,
    confirmDespublicarProducto,
} from "../pages/docente/components/misProductos/productoSwal";

const PAGE_SIZE = 10;

export const useMisProductos = () => {

    const [productos, setProductos] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [toggling, setToggling]   = useState(null);
    const [productoDetalle, setProductoDetalle] = useState(null);

    const fetchProductos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMisProductos();
            setProductos(data);
        } catch (e) {
            setError(e.response?.data?.message ?? e.message ?? "Error al cargar productos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProductos(); }, [fetchProductos]);

    const resumen = useMemo(() => ({
        total:         productos.length,
        publicados:    productos.filter((p) => p.publicado).length,
        sinPublicar:   productos.filter((p) => !p.publicado).length,
        ultimos30Dias: productos.filter((p) => esReciente(p.fechaCreacion)).length,
    }), [productos]);

    const [busqueda, setBusqueda]               = useState("");
    const [filtroEstado, setFiltroEstado]         = useState("TODOS");
    const [filtroCategoria, setFiltroCategoria]   = useState("TODAS");
    const [filtroTipo, setFiltroTipo]             = useState("TODOS");
    const [pagina, setPagina]                     = useState(0);

    const categoriasDisponibles = useMemo(() => {
        const set = new Set(productos.map((p) => p.categoria).filter(Boolean));
        return ["TODAS", ...set];
    }, [productos]);

    const tiposDisponibles = useMemo(() => {
        const base = productos.filter(
            (p) => filtroCategoria === "TODAS" || p.categoria === filtroCategoria
        );
        const set = new Set(base.map((p) => p.tipo).filter(Boolean));
        return ["TODOS", ...set];
    }, [productos, filtroCategoria]);

    const handleFiltroCategoria = useCallback((v) => {
        setFiltroCategoria(v);
        setFiltroTipo("TODOS");
        setPagina(0);
    }, []);

    const productosFiltrados = useMemo(() =>
        productos.filter((p) => {
            const matchBusqueda = !busqueda ||
                p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
            const matchEstado =
                filtroEstado === "TODOS" ||
                (filtroEstado === "PUBLICADO"     &&  p.publicado) ||
                (filtroEstado === "SIN_PUBLICAR"  && !p.publicado);
            const matchCategoria = filtroCategoria === "TODAS" || p.categoria === filtroCategoria;
            const matchTipo      = filtroTipo === "TODOS" || p.tipo === filtroTipo;
            return matchBusqueda && matchEstado && matchCategoria && matchTipo;
        }),
    [productos, busqueda, filtroEstado, filtroCategoria, filtroTipo]);

    const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / PAGE_SIZE));

    useEffect(() => {
        if (pagina >= totalPaginas) setPagina(Math.max(0, totalPaginas - 1));
    }, [pagina, totalPaginas]);

    const productosPaginados = useMemo(() => {
        const inicio = pagina * PAGE_SIZE;
        return productosFiltrados.slice(inicio, inicio + PAGE_SIZE);
    }, [productosFiltrados, pagina]);

    const irPagina = useCallback(
        (nueva) => setPagina(Math.max(0, Math.min(nueva, totalPaginas - 1))),
        [totalPaginas],
    );

    const resetPagina = useCallback(() => setPagina(0), []);

    const handleBusqueda = useCallback((v) => { setBusqueda(v); resetPagina(); }, [resetPagina]);
    const handleFiltroEstado = useCallback((v) => { setFiltroEstado(v); resetPagina(); }, [resetPagina]);
    const handleFiltroTipo = useCallback((v) => { setFiltroTipo(v); resetPagina(); }, [resetPagina]);

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
            setProductos((prev) => prev.map((p) => p.id === producto.id ? data : p));
            setProductoDetalle((prev) => (prev?.id === data.id ? data : prev));
            notifySuccess(
                producto.publicado ? "Producto despublicado" : "Producto publicado",
                producto.publicado
                    ? `"${producto.nombre}" fue actualizado.`
                    : `"${producto.nombre}" ya está en el catálogo.`,
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

    const abrirDetalle = useCallback((producto) => {
        setProductoDetalle(producto);
    }, []);

    const cerrarDetalle = useCallback(() => {
        setProductoDetalle(null);
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

    return {
        productos: productosPaginados,
        productosFiltrados,
        resumen,
        loading,
        error,
        refetch: fetchProductos,
        busqueda, setBusqueda: handleBusqueda,
        filtroEstado, setFiltroEstado: handleFiltroEstado,
        filtroCategoria, handleFiltroCategoria,
        filtroTipo, setFiltroTipo: handleFiltroTipo,
        categoriasDisponibles,
        tiposDisponibles,
        pagina, totalPaginas, pageSize: PAGE_SIZE, irPagina,
        abrirDetalle,
        cerrarDetalle,
        productoDetalle,
        toggleFromDetalle,
        eliminarFromDetalle,
        eliminarProducto: eliminarProductoHandler,
        toggling,
        togglePublicacion,
        handleDescargar,
    };
};
