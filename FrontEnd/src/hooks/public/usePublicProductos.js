import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductosPublicos } from "../../services/productoServices";
import { descargarProductoPublico } from "../../utils/publicProductoDownload";
import {
    esReciente,
    matchRangoFecha,
    CATEGORIA_LABELS,
} from "../../pages/docente/components/productoHelpers";

const PAGE_SIZE = 10;

const nombreDocente = (p) => {
    const partes = [p.docenteNombre, p.docenteApellido].filter(Boolean);
    return partes.length ? partes.join(" ") : "";
};

const patchSearchParams = (prev, patch, resetPage = false) => {
    const next = new URLSearchParams(prev);
    if (resetPage) next.delete("pagina");
    Object.entries(patch).forEach(([key, value]) => {
        const empty = value === "" || value === "TODAS" || value === "TODOS" || value == null;
        if (empty) next.delete(key);
        else next.set(key, String(value));
    });
    return next;
};

export const usePublicProductos = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const busqueda = searchParams.get("q") ?? "";
    const filtroCategoria = searchParams.get("categoria") ?? "TODAS";
    const filtroTipo = searchParams.get("tipo") ?? "TODOS";
    const fechaDesde = searchParams.get("desde") ?? "";
    const fechaHasta = searchParams.get("hasta") ?? "";
    const filtroCampoFecha = searchParams.get("campoFecha") ?? "fechaPublicacionSgpa";
    const pagina = Math.max(0, parseInt(searchParams.get("pagina") ?? "1", 10) - 1);

    const updateParams = useCallback((patch, resetPage = false) => {
        setSearchParams((prev) => patchSearchParams(prev, patch, resetPage), { replace: true });
    }, [setSearchParams]);

    const fetchProductos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setProductos(await getProductosPublicos());
        } catch (e) {
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "Error al cargar productos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProductos(); }, [fetchProductos]);

    const categoriasDisponibles = useMemo(() => {
        const set = new Set(productos.map((p) => p.categoria).filter(Boolean));
        return ["TODAS", ...set];
    }, [productos]);

    const tiposDisponibles = useMemo(() => {
        const base = productos.filter(
            (p) => filtroCategoria === "TODAS" || p.categoria === filtroCategoria,
        );
        const set = new Set(base.map((p) => p.tipo).filter(Boolean));
        return ["TODOS", ...set];
    }, [productos, filtroCategoria]);

    const handleFiltroCategoria = useCallback((v) => {
        setSearchParams((prev) => {
            const next = patchSearchParams(prev, { categoria: v }, true);
            next.delete("tipo");
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const productosFiltrados = useMemo(() =>
        productos.filter((p) => {
            const q = busqueda.toLowerCase();
            const docente = nombreDocente(p).toLowerCase();
            const matchBusqueda = !busqueda
                || p.nombre?.toLowerCase().includes(q)
                || p.descripcion?.toLowerCase().includes(q)
                || p.docenteCodigo?.toLowerCase().includes(q)
                || docente.includes(q);
            const matchCategoria = filtroCategoria === "TODAS" || p.categoria === filtroCategoria;
            const matchTipo = filtroTipo === "TODOS" || p.tipo === filtroTipo;
            const matchFecha = matchRangoFecha(p, { fechaDesde, fechaHasta, campo: filtroCampoFecha });
            return matchBusqueda && matchCategoria && matchTipo && matchFecha;
        }),
    [productos, busqueda, filtroCategoria, filtroTipo, fechaDesde, fechaHasta, filtroCampoFecha]);

    const resumenGlobal = useMemo(() => {
        const counts = {};
        productos.forEach((p) => {
            if (p.categoria) counts[p.categoria] = (counts[p.categoria] || 0) + 1;
        });
        return {
            total: productos.length,
            ultimos30Dias: productos.filter((p) => esReciente(p.fechaPublicacionSgpa)).length,
            porCategoria: Object.entries(counts)
                .map(([categoria, count]) => ({
                    categoria,
                    label: CATEGORIA_LABELS[categoria] ?? categoria,
                    count,
                }))
                .sort((a, b) => b.count - a.count),
        };
    }, [productos]);

    const resumen = useMemo(() => ({
        total: productosFiltrados.length,
        ultimos30Dias: productosFiltrados.filter((p) => esReciente(p.fechaPublicacionSgpa)).length,
    }), [productosFiltrados]);

    const hayFiltrosActivos = Boolean(
        busqueda || filtroCategoria !== "TODAS" || filtroTipo !== "TODOS"
        || fechaDesde || fechaHasta,
    );

    const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / PAGE_SIZE));

    useEffect(() => {
        if (pagina > 0 && pagina >= totalPaginas) {
            updateParams({ pagina: totalPaginas <= 1 ? "" : String(totalPaginas) });
        }
    }, [pagina, totalPaginas, updateParams]);

    const productosPaginados = useMemo(() => {
        const inicio = pagina * PAGE_SIZE;
        return productosFiltrados.slice(inicio, inicio + PAGE_SIZE);
    }, [productosFiltrados, pagina]);

    const irPagina = useCallback((nueva) => {
        const idx = Math.max(0, Math.min(nueva, totalPaginas - 1));
        updateParams({ pagina: idx <= 0 ? "" : String(idx + 1) });
    }, [totalPaginas, updateParams]);

    const handleBusqueda = useCallback((v) => updateParams({ q: v }, true), [updateParams]);
    const handleFiltroTipo = useCallback((v) => updateParams({ tipo: v }, true), [updateParams]);
    const handleFechaDesde = useCallback((v) => updateParams({ desde: v }, true), [updateParams]);
    const handleFechaHasta = useCallback((v) => updateParams({ hasta: v }, true), [updateParams]);
    const handleFiltroCampoFecha = useCallback(
        (v) => updateParams({ campoFecha: v === "fechaPublicacionSgpa" ? "" : v }, true),
        [updateParams],
    );

    const limpiarFiltros = useCallback(() => {
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    const handleDescargar = useCallback(
        (producto, archivo = null) => descargarProductoPublico(producto, archivo),
        [],
    );

    return {
        productos: productosPaginados,
        todosProductos: productos,
        productosFiltrados,
        resumen,
        resumenGlobal,
        hayFiltrosActivos,
        loading,
        error,
        refetch: fetchProductos,
        busqueda,
        setBusqueda: handleBusqueda,
        filtroCategoria,
        handleFiltroCategoria,
        filtroTipo,
        setFiltroTipo: handleFiltroTipo,
        fechaDesde,
        setFechaDesde: handleFechaDesde,
        fechaHasta,
        setFechaHasta: handleFechaHasta,
        filtroCampoFecha,
        setFiltroCampoFecha: handleFiltroCampoFecha,
        limpiarFiltros,
        categoriasDisponibles,
        tiposDisponibles,
        pagina,
        totalPaginas,
        pageSize: PAGE_SIZE,
        irPagina,
        handleDescargar,
    };
};
