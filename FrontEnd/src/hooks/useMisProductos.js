import { useState, useEffect, useMemo, useCallback } from "react";
import {
    getMisProductos,
    eliminarProducto,
    descargarArchivo,
} from "../services/productoServices";
import { notifySuccess, notifyError } from "../utils/notify";
import { esReciente } from "../pages/docente/components/productoHelpers";
import {
    intentarEliminarProducto,
} from "../pages/docente/components/misProductos/productoSwal";
import axiosInstance from "../services/axiosInstance";

const PAGE_SIZE = 10;

const publicarProducto    = (id) => axiosInstance.patch(`/api/productos/${id}/publicar`);
const despublicarProducto = (id) => axiosInstance.patch(`/api/productos/${id}/despublicar`);

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

    const handleDescargar = useCallback(async (producto) => {
        if (!producto.nombreArchivo) return;
        try {
            await descargarArchivo(producto.id, producto.nombreArchivoOriginal);
        } catch {
            notifyError("Error", "No se pudo descargar el archivo");
        }
    }, []);

    const togglePublicacion = useCallback(async (producto) => {
        setToggling(producto.id);
        try {
            const fn = producto.publicado ? despublicarProducto : publicarProducto;
            const { data } = await fn(producto.id);
            setProductos((prev) => prev.map((p) => p.id === producto.id ? data : p));
            setProductoDetalle((prev) => (prev?.id === data.id ? data : prev));
            notifySuccess(
                producto.publicado ? "Producto despublicado" : "Producto publicado",
                `"${producto.nombre}" fue actualizado.`,
            );
        } catch (e) {
            notifyError("Error", e.response?.data?.message ?? "No se pudo actualizar el estado");
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
