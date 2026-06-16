import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
    getProductosPublicos,
    getResumenProductosPublicos,
    getProductoSchema,
} from "../../services/productoServices";
import { descargarProductoPublico } from "../../utils/publicProductoDownload";
import { getFacultades, getProgramas } from "../../services/institucionService";
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
    docenteQuery,
    filtroCategoria,
    filtroSubcategoria,
    filtroTipo,
    filtroFacultad,
    filtroPrograma,
    fechaDesde,
    fechaHasta,
    pagina,
}) => {
    const params = { page: pagina, size: PAGE_SIZE };
    const termino = (docenteQuery || busqueda).trim();
    if (termino) params.q = termino;
    if (filtroCategoria !== "TODAS") params.categoria = filtroCategoria;
    if (filtroSubcategoria !== "TODAS") params.subcategoria = filtroSubcategoria;
    if (filtroTipo !== "TODOS") params.tipo = filtroTipo;
    if (filtroFacultad !== "TODAS") params.facultad = filtroFacultad;
    if (filtroPrograma !== "TODOS") params.programa = filtroPrograma;
    if (fechaDesde) params.desde = fechaDesde;
    if (fechaHasta) params.hasta = fechaHasta;
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
    const [facultades, setFacultades] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refrescando, setRefrescando] = useState(false);
    const [error, setError] = useState(null);
    const haCargadoRef = useRef(false);

    const busqueda = searchParams.get("q") ?? "";
    const docenteFiltro = searchParams.get("docenteNombre") ?? searchParams.get("docente") ?? "";
    const docenteCodigo = searchParams.get("docenteCodigo") ?? "";
    const docenteQuery = docenteCodigo || docenteFiltro;
    const filtroCategoria = searchParams.get("categoria") ?? "TODAS";
    const filtroSubcategoria = searchParams.get("subcategoria") ?? "TODAS";
    const filtroTipo = searchParams.get("tipo") ?? "TODOS";
    const filtroFacultad = searchParams.get("facultad") ?? "TODAS";
    const filtroPrograma = searchParams.get("programa") ?? "TODOS";
    const fechaDesde = searchParams.get("desde") ?? "";
    const fechaHasta = searchParams.get("hasta") ?? "";
    const pagina = Math.max(0, parseInt(searchParams.get("pagina") ?? "1", 10) - 1);

    useEffect(() => {
        if (!searchParams.get("campoFecha")) return;
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete("campoFecha");
            return next;
        }, { replace: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps -- limpiar URLs antiguas solo al montar
    }, []);

    const updateParams = useCallback((patch, resetPage = false) => {
        setSearchParams((prev) => patchSearchParams(prev, patch, resetPage), { replace: true });
    }, [setSearchParams]);

    useEffect(() => {
        getProductoSchema()
            .then(setSchema)
            .catch(() => setSchema([]));
    }, []);

    useEffect(() => {
        getFacultades()
            .then(setFacultades)
            .catch(() => setFacultades([]));
        getProgramas()
            .then(setProgramas)
            .catch(() => setProgramas([]));
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
            docenteQuery,
            filtroCategoria,
            filtroSubcategoria,
            filtroTipo,
            filtroFacultad,
            filtroPrograma,
            fechaDesde,
            fechaHasta,
            pagina,
        });

        const timer = setTimeout(() => {
            fetchProductos(params, { esRefresco: haCargadoRef.current });
        }, (busqueda || docenteQuery) ? DEBOUNCE_MS : 0);

        return () => clearTimeout(timer);
    }, [
        busqueda,
        docenteQuery,
        filtroCategoria,
        filtroSubcategoria,
        filtroTipo,
        filtroFacultad,
        filtroPrograma,
        fechaDesde,
        fechaHasta,
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

    const subcategoriasDisponibles = useMemo(() => {
        if (!schema.length) return ["TODAS"];

        const categorias = filtroCategoria === "TODAS"
            ? schema
            : schema.filter((c) => c.nombre === filtroCategoria);
        const subs = [...new Set(
            categorias.flatMap((c) =>
                (c.subcategorias ?? []).map((s) => s.nombre).filter(Boolean),
            ),
        )];
        return ["TODAS", ...subs];
    }, [schema, filtroCategoria]);

    const tiposDisponibles = useMemo(() => {
        if (!schema.length) return ["TODOS"];

        const categorias = filtroCategoria === "TODAS"
            ? schema
            : schema.filter((c) => c.nombre === filtroCategoria);
        const subs = categorias.flatMap((c) => c.subcategorias ?? []);
        const subsFiltradas = filtroSubcategoria === "TODAS"
            ? subs
            : subs.filter((s) => s.nombre === filtroSubcategoria);
        const tipos = [...new Set(
            subsFiltradas.flatMap((sub) =>
                (sub.tipos ?? []).map((t) => t.nombre).filter(Boolean),
            ),
        )];
        return ["TODOS", ...tipos];
    }, [schema, filtroCategoria, filtroSubcategoria]);

    const programasFiltrados = useMemo(() => {
        if (filtroFacultad === "TODAS") return programas;
        return programas.filter((p) => String(p.facultadId) === String(filtroFacultad));
    }, [programas, filtroFacultad]);

    const handleFiltroCategoria = useCallback((v) => {
        setSearchParams((prev) => {
            const next = patchSearchParams(prev, { categoria: v }, true);
            next.delete("tipo");
            next.delete("subcategoria");
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const handleFiltroSubcategoria = useCallback((v) => {
        setSearchParams((prev) => {
            const next = patchSearchParams(prev, { subcategoria: v }, true);
            next.delete("tipo");
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const handleFiltroFacultad = useCallback((v) => {
        setSearchParams((prev) => {
            const next = patchSearchParams(prev, { facultad: v }, true);
            next.delete("programa");
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const handleFiltroPrograma = useCallback((v) => {
        updateParams({ programa: v }, true);
    }, [updateParams]);

    useEffect(() => {
        if (filtroPrograma === "TODOS" || !programas.length) return;
        const valido = programasFiltrados.some((p) => String(p.id) === String(filtroPrograma));
        if (!valido) handleFiltroPrograma("TODOS");
    }, [filtroFacultad, programasFiltrados, filtroPrograma, handleFiltroPrograma, programas.length]);

    const hayFiltrosActivos = Boolean(
        busqueda || docenteFiltro || filtroCategoria !== "TODAS" || filtroSubcategoria !== "TODAS"
        || filtroTipo !== "TODOS" || filtroFacultad !== "TODAS" || filtroPrograma !== "TODOS"
        || fechaDesde || fechaHasta,
    );

    const filtrarPorDocente = useCallback((productoONombre) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete("pagina");
            next.delete("q");
            next.delete("docente");
            next.delete("docenteNombre");
            next.delete("docenteCodigo");

            const nombreLimpio = typeof productoONombre === "string"
                ? productoONombre.trim()
                : [productoONombre?.docenteNombre, productoONombre?.docenteApellido]
                    .filter(Boolean).join(" ").trim();
            const codigoDocente = typeof productoONombre === "object"
                ? productoONombre?.docenteCodigo
                : null;

            if (!nombreLimpio && !codigoDocente) return next;

            if (codigoDocente) {
                next.set("docenteCodigo", codigoDocente);
                if (nombreLimpio) next.set("docenteNombre", nombreLimpio);
            } else if (nombreLimpio) {
                next.set("docente", nombreLimpio);
            }
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const quitarFiltroDocente = useCallback(() => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.delete("docente");
            next.delete("docenteNombre");
            next.delete("docenteCodigo");
            return next;
        }, { replace: true });
    }, [setSearchParams]);

    const irPagina = useCallback((nueva) => {
        const idx = Math.max(0, Math.min(nueva, totalPaginas - 1));
        updateParams({ pagina: idx <= 0 ? "" : String(idx + 1) });
    }, [totalPaginas, updateParams]);

    const handleBusqueda = useCallback((v) => {
        setSearchParams((prev) => {
            const next = patchSearchParams(prev, { q: v }, true);
            next.delete("docente");
            next.delete("docenteNombre");
            next.delete("docenteCodigo");
            return next;
        }, { replace: true });
    }, [setSearchParams]);
    const handleFiltroTipo = useCallback((v) => updateParams({ tipo: v }, true), [updateParams]);
    const handleFechaDesde = useCallback((v) => updateParams({ desde: v }, true), [updateParams]);
    const handleFechaHasta = useCallback((v) => updateParams({ hasta: v }, true), [updateParams]);

    const limpiarFiltros = useCallback(() => {
        setSearchParams({}, { replace: true });
    }, [setSearchParams]);

    const refetch = useCallback(() => {
        fetchProductos(buildQueryParams({
            busqueda,
            docenteQuery,
            filtroCategoria,
            filtroSubcategoria,
            filtroTipo,
            filtroFacultad,
            filtroPrograma,
            fechaDesde,
            fechaHasta,
            pagina,
        }), { esRefresco: true });
    }, [
        fetchProductos,
        busqueda,
        docenteQuery,
        filtroCategoria,
        filtroSubcategoria,
        filtroTipo,
        filtroFacultad,
        filtroPrograma,
        fechaDesde,
        fechaHasta,
        pagina,
    ]);

    const etiquetaFacultad = useMemo(() => {
        if (filtroFacultad === "TODAS") return null;
        return facultades.find((f) => String(f.id) === String(filtroFacultad))?.nombre ?? filtroFacultad;
    }, [facultades, filtroFacultad]);

    const etiquetaPrograma = useMemo(() => {
        if (filtroPrograma === "TODOS") return null;
        return programas.find((p) => String(p.id) === String(filtroPrograma))?.nombre ?? filtroPrograma;
    }, [programas, filtroPrograma]);

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
        docenteFiltro,
        filtrarPorDocente,
        quitarFiltroDocente,
        filtroCategoria,
        handleFiltroCategoria,
        filtroSubcategoria,
        handleFiltroSubcategoria,
        filtroFacultad,
        handleFiltroFacultad,
        filtroPrograma,
        handleFiltroPrograma,
        filtroTipo,
        setFiltroTipo: handleFiltroTipo,
        fechaDesde,
        setFechaDesde: handleFechaDesde,
        fechaHasta,
        setFechaHasta: handleFechaHasta,
        limpiarFiltros,
        categoriasDisponibles,
        subcategoriasDisponibles,
        tiposDisponibles,
        facultades,
        programasFiltrados,
        etiquetaFacultad,
        etiquetaPrograma,
        pagina,
        totalPaginas,
        pageSize: PAGE_SIZE,
        irPagina,
        handleDescargar,
        schema,
    };
};
