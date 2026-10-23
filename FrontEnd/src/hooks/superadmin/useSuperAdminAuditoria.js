import { useState, useEffect, useCallback, useRef } from "react";
import { getAuditLogs, getAuditResumen } from "../../services/auditoriaService";

const PAGE_SIZE = 15;
const ESPERA_BUSQUEDA_MS = 400;

export const useSuperAdminAuditoria = () => {
    const [logs, setLogs]               = useState([]);
    const [resumen, setResumen]         = useState(null);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [pagina, setPagina]           = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [logDetalle, setLogDetalle]   = useState(null);

    // busquedaInput es lo que se escribe; busqueda es el término aplicado tras una pausa al teclear
    const [busquedaInput, setBusquedaInput] = useState("");
    const [busqueda, setBusqueda]       = useState("");
    const [filtroModulo, setFiltroModulo]     = useState("TODOS");
    const [filtroResultado, setFiltroResultado] = useState("TODOS");
    const [fechaDesde, setFechaDesde]   = useState("");
    const [fechaHasta, setFechaHasta]   = useState("");
    const ultimaPeticion = useRef(0);

    useEffect(() => {
        const termino = busquedaInput.trim();
        if (termino === busqueda) return;
        const t = setTimeout(() => {
            setBusqueda(termino);
            setPagina(0);
        }, ESPERA_BUSQUEDA_MS);
        return () => clearTimeout(t);
    }, [busquedaInput, busqueda]);

    const fetchLogs = useCallback(async () => {
        // Solo la petición más reciente actualiza el estado; una respuesta lenta no pisa a la nueva
        const peticion = ++ultimaPeticion.current;
        setLoading(true);
        setError(null);
        try {
            const params = {
                page: pagina,
                size: PAGE_SIZE,
            };
            if (busqueda.trim()) params.busqueda = busqueda.trim();
            if (filtroModulo !== "TODOS") params.modulo = filtroModulo;
            if (filtroResultado !== "TODOS") params.resultado = filtroResultado;
            if (fechaDesde) params.desde = fechaDesde;
            if (fechaHasta) params.hasta = fechaHasta;

            const data = await getAuditLogs(params);
            if (peticion !== ultimaPeticion.current) return;
            setLogs(data.content ?? []);
            setTotalPaginas(data.totalPages ?? 1);
            setTotalElements(data.totalElements ?? 0);
        } catch (e) {
            if (peticion !== ultimaPeticion.current) return;
            setError(e.response?.data?.error ?? e.message ?? "Error al cargar logs");
        } finally {
            if (peticion === ultimaPeticion.current) setLoading(false);
        }
    }, [pagina, busqueda, filtroModulo, filtroResultado, fechaDesde, fechaHasta]);

    const fetchResumen = useCallback(async () => {
        try {
            setResumen(await getAuditResumen());
        } catch {
            /* resumen opcional */
        }
    }, []);

    useEffect(() => { fetchResumen(); }, [fetchResumen]);
    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const refetch = useCallback(() => {
        fetchResumen();
        fetchLogs();
    }, [fetchResumen, fetchLogs]);

    const resetPagina = useCallback(() => setPagina(0), []);

    const handleFiltroModulo = useCallback((v) => { setFiltroModulo(v); resetPagina(); }, [resetPagina]);
    const handleFiltroResultado = useCallback((v) => { setFiltroResultado(v); resetPagina(); }, [resetPagina]);
    const handleFechaDesde = useCallback((v) => { setFechaDesde(v); resetPagina(); }, [resetPagina]);
    const handleFechaHasta = useCallback((v) => { setFechaHasta(v); resetPagina(); }, [resetPagina]);

    const irPagina = useCallback(
        (nueva) => setPagina(Math.max(0, Math.min(nueva, totalPaginas - 1))),
        [totalPaginas],
    );

    const kpis = resumen ? [
        { label: "Eventos (hoy)", value: resumen.eventosHoy, accent: "bg-[#ffc20e]/15 text-[#EC7A21]" },
        { label: "Críticos (7 días)", value: resumen.criticos7Dias, accent: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
        { label: "Usuarios únicos (7 días)", value: resumen.usuariosUnicos7Dias, accent: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
        { label: "Fallidos (hoy)", value: resumen.fallidosHoy, accent: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
    ] : [];

    return {
        logs, resumen, kpis,
        loading, error, refetch,
        busqueda: busquedaInput, setBusqueda: setBusquedaInput,
        filtroModulo, setFiltroModulo: handleFiltroModulo,
        filtroResultado, setFiltroResultado: handleFiltroResultado,
        fechaDesde, setFechaDesde: handleFechaDesde,
        fechaHasta, setFechaHasta: handleFechaHasta,
        pagina, totalPaginas, totalElements, pageSize: PAGE_SIZE, irPagina,
        logDetalle, abrirDetalle: setLogDetalle, cerrarDetalle: () => setLogDetalle(null),
    };
};
