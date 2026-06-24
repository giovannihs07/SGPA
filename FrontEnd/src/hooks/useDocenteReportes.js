import { useState, useEffect, useCallback, useMemo } from "react";
import { BookOpen, Globe, FileCheck, Clock } from "lucide-react";
import { getMisProductos } from "../services/productoServices";
import { getMiPerfilDocente } from "../services/docenteService";
import { agruparConteo, agruparPorAnio, agruparPorTipoDetalle } from "../pages/admin/adminReportesHelpers";
import {
    calcularResumenPersonal,
    filtrarMisProductosReporte,
} from "../pages/docente/docenteReportesHelpers";

export const useDocenteReportes = () => {
    const [productos, setProductos] = useState([]);
    const [docente, setDocente]     = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);

    const [filtroEstado, setFiltroEstado] = useState("TODOS");
    const [filtroCategoria, setFiltroCategoria] = useState("TODAS");
    const [filtroSubcategoria, setFiltroSubcategoria] = useState("TODAS");
    const [filtroTipo, setFiltroTipo] = useState("TODOS");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [filtroCampoFecha, setFiltroCampoFecha] = useState("fechaRegistroSgpa");
    const [busqueda, setBusqueda] = useState("");

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
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "Error al cargar tu producción");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filtros = useMemo(() => ({
        filtroEstado,
        filtroCategoria,
        filtroSubcategoria,
        filtroTipo,
        fechaDesde,
        fechaHasta,
        filtroCampoFecha,
        busqueda,
    }), [filtroEstado, filtroCategoria, filtroSubcategoria, filtroTipo, fechaDesde, fechaHasta, filtroCampoFecha, busqueda]);

    const productosFiltrados = useMemo(
        () => filtrarMisProductosReporte(productos, filtros),
        [productos, filtros],
    );

    const resumen = useMemo(
        () => calcularResumenPersonal(productosFiltrados),
        [productosFiltrados],
    );

    const kpis = useMemo(() => [
        { label: "Total productos", value: resumen.total, icon: BookOpen, accent: "bg-[#ffc20e]/15 text-[#EC7A21]" },
        { label: "Publicados", value: resumen.publicados, icon: Globe, accent: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
        { label: "Sin publicar", value: resumen.sinPublicar, icon: FileCheck, accent: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
        { label: "Nuevos (30 días)", value: resumen.recientes, icon: Clock, accent: "bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20" },
    ], [resumen]);

    const porAnio = useMemo(
        () => agruparPorAnio(productosFiltrados, filtroCampoFecha),
        [productosFiltrados, filtroCampoFecha],
    );

    const porCategoria = useMemo(
        () => agruparConteo(productosFiltrados, (p) => p.categoria),
        [productosFiltrados],
    );

    const porSubcategoria = useMemo(
        () => agruparConteo(productosFiltrados, (p) => p.subcategoria),
        [productosFiltrados],
    );

    const porTipo = useMemo(
        () => agruparPorTipoDetalle(productosFiltrados),
        [productosFiltrados],
    );

    const categoriasDisponibles = useMemo(() => {
        const set = new Set(productos.map((p) => p.categoria).filter(Boolean));
        return ["TODAS", ...set];
    }, [productos]);

    const subcategoriasDisponibles = useMemo(() => {
        const base = productos.filter(
            (p) => filtroCategoria === "TODAS" || p.categoria === filtroCategoria,
        );
        const set = new Set(base.map((p) => p.subcategoria).filter(Boolean));
        return ["TODAS", ...set];
    }, [productos, filtroCategoria]);

    const tiposDisponibles = useMemo(() => {
        const base = productos.filter((p) => {
            const matchCat = filtroCategoria === "TODAS" || p.categoria === filtroCategoria;
            const matchSub = filtroSubcategoria === "TODAS" || p.subcategoria === filtroSubcategoria;
            return matchCat && matchSub;
        });
        const set = new Set(base.map((p) => p.tipo).filter(Boolean));
        return ["TODOS", ...set];
    }, [productos, filtroCategoria, filtroSubcategoria]);

    const handleFiltroCategoria = useCallback((v) => {
        setFiltroCategoria(v);
        setFiltroSubcategoria("TODAS");
        setFiltroTipo("TODOS");
    }, []);

    const handleFiltroSubcategoria = useCallback((v) => {
        setFiltroSubcategoria(v);
        setFiltroTipo("TODOS");
    }, []);

    useEffect(() => {
        if (filtroTipo === "TODOS" || !tiposDisponibles.length) return;
        if (!tiposDisponibles.includes(filtroTipo)) setFiltroTipo("TODOS");
    }, [tiposDisponibles, filtroTipo]);

    return {
        docente,
        loading,
        error,
        refetch: fetchData,
        filtros,
        filtroEstado,
        setFiltroEstado,
        filtroCategoria,
        setFiltroCategoria: handleFiltroCategoria,
        filtroSubcategoria,
        setFiltroSubcategoria: handleFiltroSubcategoria,
        filtroTipo,
        setFiltroTipo,
        fechaDesde,
        setFechaDesde,
        fechaHasta,
        setFechaHasta,
        filtroCampoFecha,
        setFiltroCampoFecha,
        busqueda,
        setBusqueda,
        categoriasDisponibles,
        subcategoriasDisponibles,
        tiposDisponibles,
        resumen,
        kpis,
        porAnio,
        porCategoria,
        porSubcategoria,
        porTipo,
        productosFiltrados,
        totalFiltrados: productosFiltrados.length,
    };
};
