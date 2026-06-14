import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
    getProductosPublicos,
    getResumenProductosPublicos,
    getProductoSchema,
} from "../../services/productoServices";
import { descargarProductoPublico } from "../../utils/publicProductoDownload";
import { CATEGORIA_LABELS } from "../../pages/docente/components/productoHelpers";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;

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

const buildQueryParams = ({
    busqueda,
    filtroCategoria,
    filtroTipo,
    fechaDesde,
    fechaHasta,
    filtroCampoFecha,
    pagina,
}) => {
    const params = { page: pagina, size: PAGE_SIZE };
    if (busqueda.trim()) params.q = busqueda.trim();
    if (filtroCategoria !== "TODAS") params.categoria = filtroCategoria;
    if (filtroTipo !== "TODOS") params.tipo = filtroTipo;
    if (fechaDesde) params.desde = fechaDesde;
    if (fechaHasta) params.hasta = fechaHasta;
    if (filtroCampoFecha !== "fechaPublicacionSgpa") params.campoFecha = filtroCampoFecha;
    return params;
};

export const usePublicProductos = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [productos, setProductos] = useState([]);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [resumen, setResumen] = useState({ total: 0, ultimos30Dias: 0 });
    const [resumenGlobal, setResumenGlobal] = useState({
        total: 0,
        ultimos30Dias: 0,
        porCategoria: [],
    });
    const [schema, setSchema] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refrescando, setRefrescando] = useState(false);
    const [error, setError] = useState(null);
    const haCargadoRef = useRef(false);

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

    useEffect(() => {
        getProductoSchema()
            .then(setSchema)
            .catch(() => setSchema([]));
    }, []);

    useEffect(() => {
        getResumenProductosPublicos()
            .then((data) => {
                setResumenGlobal({
                    total: data.total ?? 0,
                    ultimos30Dias: data.ultimos30Dias ?? 0,
                    porCategoria: (data.porCategoria ?? []).map((item) => ({
                        categoria: item.categoria,
                        label: CATEGORIA_LABELS[item.categoria] ?? item.categoria,
                        count: item.count ?? 0,
                    })),
                });
            })
            .catch(() => {
                setResumenGlobal({ total: 0, ultimos30Dias: 0, porCategoria: [] });
            });
    }, []);

    const fetchProductos = useCallback(async (params, { esRefresco = false } = {}) => {
        if (esRefresco) {
            setRefrescando(true);
        } else {
            setLoading(true);
        }
        setError(null);
        try {
            const data = await getProductosPublicos(params);
            setProductos(data.content ?? []);
            setTotalPaginas(Math.max(1, data.totalPages ?? 1));
            setResumen({
                total: data.totalElements ?? 0,
                ultimos30Dias: data.ultimos30Dias ?? 0,
            });
        } catch (e) {
            setError(
                e.response?.data?.error
                ?? e.response?.data?.message
                ?? e.message
                ?? "Error al cargar productos",
            );
            if (!esRefresco) {
                setProductos([]);
                setTotalPaginas(1);
                setResumen({ total: 0, ultimos30Dias: 0 });
            }
        } finally {
            setLoading(false);
            setRefrescando(false);
            haCargadoRef.current = true;
        }
    }, []);

    useEffect(() => {
        const params = buildQueryParams({
            busqueda,
            filtroCategoria,
            filtroTipo,
            fechaDesde,
            fechaHasta,
            filtroCampoFecha,
            pagina,
        });

        const timer = setTimeout(() => {
            fetchProductos(params, { esRefresco: haCargadoRef.current });
        }, busqueda ? DEBOUNCE_MS : 0);

        return () => clearTimeout(timer);
    }, [
        busqueda,
        filtroCategoria,
        filtroTipo,
        fechaDesde,
        fechaHasta,
        filtroCampoFecha,
        pagina,
        fetchProductos,
    ]);

    useEffect(() => {
        if (pagina > 0 && pagina >= totalPaginas) {
            updateParams({ pagina: totalPaginas <= 1 ? "" : String(totalPaginas) });
        }
    }, [pagina, totalPaginas, updateParams]);

    const categoriasDisponibles = useMemo(() => {
        const nombres = schema.map((c) => c.nombre).filter(Boolean);
        return nombres.length ? ["TODAS", ...nombres] : ["TODAS"];
    }, [schema]);

    const tiposDisponibles = useMemo(() => {
        if (!schema.length) return ["TODOS"];

        const extraerTipos = (categorias) => categorias.flatMap((cat) =>
            (cat.subcategorias ?? []).flatMap((sub) =>
                (sub.tipos ?? []).map((t) => t.nombre).filter(Boolean),
            ),
        );

        if (filtroCategoria === "TODAS") {
            const tipos = [...new Set(extraerTipos(schema))];
            return ["TODOS", ...tipos];
        }

        const categoria = schema.find((c) => c.nombre === filtroCategoria);
        const tipos = categoria ? [...new Set(extraerTipos([categoria]))] : [];
        return ["TODOS", ...tipos];
    }, [schema, filtroCategoria]);

    const handleFiltroCategoria = useCallback((v) => {
        setSearchParams((prev) => {
            const next = patchSearchParams(prev, { categoria: v }, true);
            next.delete("tipo");
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const hayFiltrosActivos = Boolean(
        busqueda || filtroCategoria !== "TODAS" || filtroTipo !== "TODOS"
        || fechaDesde || fechaHasta,
    );

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

    const refetch = useCallback(() => {
        fetchProductos(buildQueryParams({
            busqueda,
            filtroCategoria,
            filtroTipo,
            fechaDesde,
            fechaHasta,
            filtroCampoFecha,
            pagina,
        }), { esRefresco: true });
    }, [
        fetchProductos,
        busqueda,
        filtroCategoria,
        filtroTipo,
        fechaDesde,
        fechaHasta,
        filtroCampoFecha,
        pagina,
    ]);

    const handleDescargar = useCallback(
        (producto, archivo = null) => descargarProductoPublico(producto, archivo),
        [],
    );

    const productosFiltrados = productos;

    return {
        productos,
        todosProductos: productos,
        productosFiltrados,
        resumen,
        resumenGlobal,
        hayFiltrosActivos,
        loading,
        refrescando,
        error,
        refetch,
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
        schema,
    };
};
