import { useState, useEffect, useCallback, useMemo } from "react";
import { BookOpen, Globe, FileCheck, Clock, Users, UserCheck, UserX } from "lucide-react";
import { getReporteProduccionEjecutivo } from "../../services/reporteService";
import { getFacultades, getProgramas } from "../../services/institucionService";

const buildReporteParams = ({
    filtroEstado,
    filtroCategoria,
    filtroSubcategoria,
    filtroTipo,
    filtroFacultad,
    filtroPrograma,
    fechaDesde,
    fechaHasta,
    filtroCampoFecha,
    busqueda,
}) => ({
    estado: filtroEstado,
    categoria: filtroCategoria,
    subcategoria: filtroSubcategoria,
    tipo: filtroTipo,
    facultadId: filtroFacultad === "TODAS" ? undefined : Number(filtroFacultad),
    programaId: filtroPrograma === "TODOS" ? undefined : Number(filtroPrograma),
    fechaDesde: fechaDesde || undefined,
    fechaHasta: fechaHasta || undefined,
    campoFecha: filtroCampoFecha,
    busqueda: busqueda?.trim() || undefined,
});

const mapConteoAnio = (items = []) =>
    items.map((item) => ({ anio: item.key, total: item.count }));

export const useAdminReportesProduccion = () => {
    const [reporte, setReporte] = useState(null);
    const [facultades, setFacultades] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [loadingCatalogos, setLoadingCatalogos] = useState(true);
    const [loadingReporte, setLoadingReporte] = useState(true);
    const [error, setError] = useState(null);

    const [filtroEstado, setFiltroEstado] = useState("TODOS");
    const [filtroCategoria, setFiltroCategoria] = useState("TODAS");
    const [filtroSubcategoria, setFiltroSubcategoria] = useState("TODAS");
    const [filtroTipo, setFiltroTipo] = useState("TODOS");
    const [filtroFacultad, setFiltroFacultad] = useState("TODAS");
    const [filtroPrograma, setFiltroPrograma] = useState("TODOS");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [filtroCampoFecha, setFiltroCampoFecha] = useState("fechaRegistroSgpa");
    const [busqueda, setBusqueda] = useState("");
    const [busquedaBorrador, setBusquedaBorrador] = useState("");

    useEffect(() => {
        setBusquedaBorrador(busqueda);
    }, [busqueda]);

    const filtros = useMemo(() => ({
        filtroEstado,
        filtroCategoria,
        filtroSubcategoria,
        filtroTipo,
        filtroFacultad,
        filtroPrograma,
        fechaDesde,
        fechaHasta,
        filtroCampoFecha,
        busqueda,
    }), [filtroEstado, filtroCategoria, filtroSubcategoria, filtroTipo, filtroFacultad, filtroPrograma, fechaDesde, fechaHasta, filtroCampoFecha, busqueda]);

    const fetchCatalogos = useCallback(async () => {
        setLoadingCatalogos(true);
        try {
            const [facultadesData, programasData] = await Promise.all([
                getFacultades(),
                getProgramas(),
            ]);
            setFacultades(facultadesData);
            setProgramas(programasData);
        } catch (e) {
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "Error al cargar catálogos institucionales");
        } finally {
            setLoadingCatalogos(false);
        }
    }, []);

    const fetchReporte = useCallback(async () => {
        setLoadingReporte(true);
        setError(null);
        try {
            const data = await getReporteProduccionEjecutivo(buildReporteParams({
                ...filtros,
                busqueda,
            }));
            setReporte(data);
        } catch (e) {
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "Error al cargar producción docente");
        } finally {
            setLoadingReporte(false);
        }
    }, [filtros, busqueda]);

    useEffect(() => { fetchCatalogos(); }, [fetchCatalogos]);

    useEffect(() => { fetchReporte(); }, [fetchReporte]);

    const loading = loadingCatalogos || loadingReporte;

    const refetch = useCallback(async () => {
        await Promise.all([fetchCatalogos(), fetchReporte()]);
    }, [fetchCatalogos, fetchReporte]);

    const resumen = reporte?.resumen ?? {
        total: 0, publicados: 0, sinPublicar: 0, recientes: 0, docentesActivos: 0,
    };

    const cobertura = reporte?.cobertura ?? {
        totalDocentes: 0, docentesConProduccion: 0, docentesSinProduccion: 0, porcentajeCobertura: 0,
    };

    const rankingDocentesTop = reporte?.graficos?.rankingDocentesTop ?? [];
    const porFacultad = reporte?.porFacultad ?? [];
    const porPrograma = reporte?.porPrograma ?? [];

    const reporteParams = useMemo(
        () => buildReporteParams({ ...filtros, busqueda }),
        [filtros, busqueda],
    );

    const programasFiltrados = useMemo(() => {
        if (filtroFacultad === "TODAS") return programas;
        return programas.filter((p) => String(p.facultadId) === String(filtroFacultad));
    }, [programas, filtroFacultad]);

    const kpis = useMemo(() => [
        { label: "Total productos", value: resumen.total, icon: BookOpen, accent: "bg-[#ffc20e]/15 text-[#EC7A21]" },
        { label: "Publicados", value: resumen.publicados, icon: Globe, accent: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
        { label: "Sin publicar", value: resumen.sinPublicar, icon: FileCheck, accent: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
        { label: "Docentes con producción", value: resumen.docentesActivos, icon: Users, accent: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
        { label: "% Cobertura docente", value: `${cobertura.porcentajeCobertura}%`, icon: UserCheck, accent: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
        { label: "Docentes sin producción", value: cobertura.docentesSinProduccion, icon: UserX, accent: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
        { label: "Nuevos (30 días)", value: resumen.recientes, icon: Clock, accent: "bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20" },
    ], [resumen, cobertura]);

    const porAnio = useMemo(
        () => mapConteoAnio(reporte?.graficos?.porAnio),
        [reporte],
    );

    const porCategoria = reporte?.graficos?.porCategoria ?? [];
    const porSubcategoria = reporte?.graficos?.porSubcategoria ?? [];
    const porTipo = reporte?.graficos?.porTipo ?? [];
    const productosRecientes = reporte?.graficos?.productosRecientes ?? [];

    const categoriasDisponibles = useMemo(() => {
        const items = reporte?.opciones?.categoriasDisponibles ?? [];
        return ["TODAS", ...items];
    }, [reporte]);

    const subcategoriasDisponibles = useMemo(() => {
        const items = reporte?.opciones?.subcategoriasDisponibles ?? [];
        return ["TODAS", ...items];
    }, [reporte]);

    const tiposDisponibles = useMemo(() => {
        const items = reporte?.opciones?.tiposDisponibles ?? [];
        return ["TODOS", ...items];
    }, [reporte]);

    const handleFiltroCategoria = useCallback((v) => {
        setFiltroCategoria(v);
        setFiltroSubcategoria("TODAS");
        setFiltroTipo("TODOS");
    }, []);

    const handleFiltroSubcategoria = useCallback((v) => {
        setFiltroSubcategoria(v);
        setFiltroTipo("TODOS");
    }, []);

    const handleFiltroFacultad = useCallback((v) => {
        setFiltroFacultad(v);
        setFiltroPrograma("TODOS");
    }, []);

    useEffect(() => {
        if (filtroTipo === "TODOS" || !tiposDisponibles.length) return;
        if (!tiposDisponibles.includes(filtroTipo)) setFiltroTipo("TODOS");
    }, [tiposDisponibles, filtroTipo]);

    const aplicarPresetPeriodo = useCallback(({ fechaDesde: desde, fechaHasta: hasta }) => {
        setFechaDesde(desde);
        setFechaHasta(hasta);
    }, []);

    const limpiarPeriodo = useCallback(() => {
        setFechaDesde("");
        setFechaHasta("");
    }, []);

    const aplicarBusqueda = useCallback((termino) => {
        const value = (termino ?? busquedaBorrador).trim();
        setBusquedaBorrador(value);
        setBusqueda(value);
    }, [busquedaBorrador]);

    const limpiarBusqueda = useCallback(() => {
        setBusquedaBorrador("");
        setBusqueda("");
    }, []);

    return {
        loading,
        error,
        refetch,
        reporte,
        reporteParams,
        filtros,
        filtroEstado,
        setFiltroEstado,
        filtroCategoria,
        setFiltroCategoria: handleFiltroCategoria,
        filtroSubcategoria,
        setFiltroSubcategoria: handleFiltroSubcategoria,
        filtroTipo,
        setFiltroTipo,
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
        busquedaBorrador,
        setBusquedaBorrador,
        aplicarBusqueda,
        limpiarBusqueda,
        categoriasDisponibles,
        subcategoriasDisponibles,
        tiposDisponibles,
        facultades,
        programasFiltrados,
        resumen,
        kpis,
        porAnio,
        porCategoria,
        porSubcategoria,
        porTipo,
        rankingDocentesTop,
        productosRecientes,
        totalFiltrados: resumen.total,
        cobertura,
        porFacultad,
        porPrograma,
        aplicarPresetPeriodo,
        limpiarPeriodo,
        notaAtribucion: reporte?.meta?.notaAtribucion ?? "",
    };
};
