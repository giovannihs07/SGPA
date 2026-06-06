import { useState, useEffect, useMemo, useCallback } from "react";
import {
    getProductosPublicados, eliminarProducto,
    descargarArchivo, descargarArchivoPublico,
} from "../../services/productoServices";
import { obtenerArchivosProducto } from "../../pages/docente/components/productoHelpers";
import { notifySuccess, notifyError } from "../../utils/notify";
import { esReciente, matchRangoFecha } from "../../pages/docente/components/productoHelpers";
import { intentarEliminarProducto, confirmTogglePublicacion } from "../../pages/docente/components/misProductos/productoSwal";
import axiosInstance from "../../services/axiosInstance";

const PAGE_SIZE = 10; // Tamaño de la página

// Funciones para publicar y despublicar el producto
const publicarProducto    = (id) => axiosInstance.patch(`/api/productos/${id}/publicar`);
const despublicarProducto = (id) => axiosInstance.patch(`/api/productos/${id}/despublicar`);

export const useSuperAdminProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [toggling, setToggling]   = useState(null);
    const [productoDetalle, setProductoDetalle] = useState(null);

    // Función para obtener los productos del backend
    const fetchProductos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setProductos(await getProductosPublicados());
        } catch (e) {
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "Error al cargar productos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProductos(); }, [fetchProductos]);

    // Función para obtener el resumen de los productos (según filtros activos)
    const [busqueda, setBusqueda]             = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("TODAS");
    const [filtroTipo, setFiltroTipo]           = useState("TODOS");
    const [fechaDesde, setFechaDesde]           = useState("");
    const [fechaHasta, setFechaHasta]           = useState("");
    const [filtroCampoFecha, setFiltroCampoFecha] = useState("fechaCreacion");
    const [pagina, setPagina]                   = useState(0);

    // Función para obtener las categorias disponibles
    const categoriasDisponibles = useMemo(() => {
        const set = new Set(productos.map((p) => p.categoria).filter(Boolean));
        return ["TODAS", ...set];
    }, [productos]);

    // Función para obtener los tipos disponibles
    const tiposDisponibles = useMemo(() => {
        const base = productos.filter(
            (p) => filtroCategoria === "TODAS" || p.categoria === filtroCategoria,
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
            const matchBusqueda = !busqueda
                || p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
                || p.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
            const matchCategoria = filtroCategoria === "TODAS" || p.categoria === filtroCategoria;
            const matchTipo      = filtroTipo === "TODOS" || p.tipo === filtroTipo;
            const matchFecha = matchRangoFecha(p, { fechaDesde, fechaHasta, campo: filtroCampoFecha });
            return matchBusqueda && matchCategoria && matchTipo && matchFecha;
        }),
    [productos, busqueda, filtroCategoria, filtroTipo, fechaDesde, fechaHasta, filtroCampoFecha]);

    const resumen = useMemo(() => ({
        total:         productosFiltrados.length,
        ultimos30Dias: productosFiltrados.filter((p) => esReciente(p.fechaCreacion)).length,
    }), [productosFiltrados]);

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
    const handleBusqueda   = useCallback((v) => { setBusqueda(v); resetPagina(); }, [resetPagina]);
    const handleFiltroTipo = useCallback((v) => { setFiltroTipo(v); resetPagina(); }, [resetPagina]);
    const handleFechaDesde = useCallback((v) => { setFechaDesde(v); resetPagina(); }, [resetPagina]);
    const handleFechaHasta = useCallback((v) => { setFechaHasta(v); resetPagina(); }, [resetPagina]);
    const handleFiltroCampoFecha = useCallback((v) => { setFiltroCampoFecha(v); resetPagina(); }, [resetPagina]);

    const handleDescargar = useCallback(async (producto, archivo = null) => {
        const lista = obtenerArchivosProducto(producto);
        const target = archivo ?? lista.find((a) => a.rol === "PRINCIPAL") ?? lista[0];
        if (!target) {
            notifyError("Sin archivo", "Este producto no tiene archivos adjuntos.");
            return;
        }
        try {
            if (target.id) {
                await descargarArchivoPublico(producto.id, target.id, target.nombreOriginal);
            } else {
                await descargarArchivo(producto.id, target.nombreOriginal);
            }
        } catch (e) {
            notifyError("Error", e.message ?? "No se pudo descargar el archivo");
        }
    }, []);

    const togglePublicacion = useCallback(async (producto) => {
        const ok = await confirmTogglePublicacion(producto);
        if (!ok) return;

        setToggling(producto.id);
        try {
            const fn = producto.publicado ? despublicarProducto : publicarProducto;
            const { data } = await fn(producto.id);
            if (producto.publicado) {
                setProductos((prev) => prev.filter((p) => p.id !== producto.id));
                setProductoDetalle((prev) => (prev?.id === producto.id ? null : prev));
            } else {
                setProductos((prev) => prev.map((p) => (p.id === producto.id ? data : p)));
                setProductoDetalle((prev) => (prev?.id === data.id ? data : prev));
            }
            notifySuccess(
                producto.publicado ? "Producto despublicado" : "Producto publicado",
                `"${producto.nombre}" fue actualizado.`,
            );
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? e.response?.data?.message ?? "No se pudo actualizar el estado");
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
                e.response?.data?.error ?? e.response?.data?.message ?? "No se pudo eliminar el producto",
            );
        }
    }, []);

    const abrirDetalle  = useCallback((p) => setProductoDetalle(p), []);
    const cerrarDetalle = useCallback(() => setProductoDetalle(null), []);

    const toggleFromDetalle = useCallback(async () => {
        if (productoDetalle) await togglePublicacion(productoDetalle);
    }, [productoDetalle, togglePublicacion]);

    const eliminarFromDetalle = useCallback(async () => {
        if (!productoDetalle) return;
        const p = productoDetalle;
        cerrarDetalle();
        await eliminarProductoHandler(p);
    }, [productoDetalle, cerrarDetalle, eliminarProductoHandler]);

    return {
        productos: productosPaginados,
        productosFiltrados,
        resumen,
        loading, error, refetch: fetchProductos,
        busqueda, setBusqueda: handleBusqueda,
        filtroCategoria, handleFiltroCategoria,
        filtroTipo, setFiltroTipo: handleFiltroTipo,
        fechaDesde, setFechaDesde: handleFechaDesde,
        fechaHasta, setFechaHasta: handleFechaHasta,
        filtroCampoFecha, setFiltroCampoFecha: handleFiltroCampoFecha,
        categoriasDisponibles, tiposDisponibles,
        pagina, totalPaginas, pageSize: PAGE_SIZE, irPagina,
        abrirDetalle, cerrarDetalle, productoDetalle,
        toggleFromDetalle, eliminarFromDetalle,
        eliminarProducto: eliminarProductoHandler,
        toggling, togglePublicacion, handleDescargar,
    };
};
