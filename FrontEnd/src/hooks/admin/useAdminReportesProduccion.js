import { useState, useEffect, useCallback, useMemo } from "react";
import { BookOpen, Globe, FileCheck, Clock, Users } from "lucide-react";
import { getAllProductos } from "../../services/productoServices";
import { getDocentes } from "../../services/docenteService";
import { getFacultades, getProgramas } from "../../services/institucionService";
import {
    agruparConteo,
    agruparPorDocente,
    calcularResumenProduccion,
    construirMapaDocentes,
    enriquecerProductosConDocente,
    filtrarProductosReporte,
} from "../../pages/admin/adminReportesHelpers";

export const useAdminReportesProduccion = () => {
    const [productosRaw, setProductosRaw] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [facultades, setFacultades] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filtroEstado, setFiltroEstado] = useState("TODOS");
    const [filtroCategoria, setFiltroCategoria] = useState("TODAS");
    const [filtroSubcategoria, setFiltroSubcategoria] = useState("TODAS");
    const [filtroFacultad, setFiltroFacultad] = useState("TODAS");
    const [filtroPrograma, setFiltroPrograma] = useState("TODOS");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [filtroCampoFecha, setFiltroCampoFecha] = useState("fechaCreacion");
    const [busqueda, setBusqueda] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [productos, docentesData, facultadesData, programasData] = await Promise.all([
                getAllProductos(),
                getDocentes(),
                getFacultades(),
                getProgramas(),
            ]);
            setProductosRaw(productos);
            setDocentes(docentesData);
            setFacultades(facultadesData);
            setProgramas(programasData);
        } catch (e) {
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "Error al cargar producción docente");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const mapaDocentes = useMemo(
        () => construirMapaDocentes(docentes),
        [docentes],
    );

    const productos = useMemo(
        () => enriquecerProductosConDocente(productosRaw, mapaDocentes),
        [productosRaw, mapaDocentes],
    );

    const filtros = useMemo(() => ({
        filtroEstado,
        filtroCategoria,
        filtroSubcategoria,
        filtroFacultad,
        filtroPrograma,
        fechaDesde,
        fechaHasta,
        filtroCampoFecha,
        busqueda,
    }), [filtroEstado, filtroCategoria, filtroSubcategoria, filtroFacultad, filtroPrograma, fechaDesde, fechaHasta, filtroCampoFecha, busqueda]);

    const productosFiltrados = useMemo(
        () => filtrarProductosReporte(productos, filtros),
        [productos, filtros],
    );

    const resumen = useMemo(
        () => calcularResumenProduccion(productosFiltrados),
        [productosFiltrados],
    );

    const kpis = useMemo(() => [
        { label: "Total productos", value: resumen.total, icon: BookOpen, accent: "bg-[#ffc20e]/15 text-[#EC7A21]" },
        { label: "Publicados", value: resumen.publicados, icon: Globe, accent: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
        { label: "Sin publicar", value: resumen.sinPublicar, icon: FileCheck, accent: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
        { label: "Docentes con producción", value: resumen.docentesActivos, icon: Users, accent: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
        { label: "Nuevos (30 días)", value: resumen.recientes, icon: Clock, accent: "bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20" },
    ], [resumen]);

    const porCategoria = useMemo(
        () => agruparConteo(productosFiltrados, (p) => p.categoria),
        [productosFiltrados],
    );

    const porSubcategoria = useMemo(
        () => agruparConteo(productosFiltrados, (p) => p.subcategoria),
        [productosFiltrados],
    );

    const porTipo = useMemo(
        () => agruparConteo(productosFiltrados, (p) => p.tipo).slice(0, 10),
        [productosFiltrados],
    );

    const rankingDocentes = useMemo(
        () => agruparPorDocente(productosFiltrados),
        [productosFiltrados],
    );

    const productosRecientes = useMemo(
        () => [...productosFiltrados]
            .sort((a, b) => new Date(b.fechaCreacion ?? 0) - new Date(a.fechaCreacion ?? 0))
            .slice(0, 10),
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

    const programasFiltrados = useMemo(() => {
        if (filtroFacultad === "TODAS") return programas;
        return programas.filter((p) => String(p.facultadId) === String(filtroFacultad));
    }, [programas, filtroFacultad]);

    const handleFiltroCategoria = useCallback((v) => {
        setFiltroCategoria(v);
        setFiltroSubcategoria("TODAS");
    }, []);

    const handleFiltroFacultad = useCallback((v) => {
        setFiltroFacultad(v);
        setFiltroPrograma("TODOS");
    }, []);

    return {
        loading,
        error,
        refetch: fetchData,
        filtros,
        filtroEstado,
        setFiltroEstado,
        filtroCategoria,
        setFiltroCategoria: handleFiltroCategoria,
        filtroSubcategoria,
        setFiltroSubcategoria,
        filtroFacultad,
        setFiltroFacultad: handleFiltroFacultad,
        filtroPrograma,
        setFiltroPrograma,
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
        facultades,
        programasFiltrados,
        resumen,
        kpis,
        porCategoria,
        porSubcategoria,
        porTipo,
        rankingDocentes,
        productosRecientes,
        productosFiltrados,
        totalFiltrados: productosFiltrados.length,
    };
};
