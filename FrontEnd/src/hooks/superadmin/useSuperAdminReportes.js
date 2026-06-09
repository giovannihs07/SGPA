import { useState, useEffect, useCallback, useMemo } from "react";
import {
    Users,
    UserCheck,
    BookOpen,
    Globe,
    Clock,
    Shield,
} from "lucide-react";
import { getUsuarios } from "../../services/usuarioService";
import { getDocentes } from "../../services/docenteService";
import { getAllProductos } from "../../services/productoServices";
import { getTaxonomiaEstado } from "../../services/taxonomiaService";
import { getAuditResumen } from "../../services/auditoriaService";
import {
    agruparConteo,
    agruparPorAnio,
    calcularCoberturaDocente,
    calcularResumenProduccion,
    construirMapaDocentes,
    enriquecerProductosConDocente,
} from "../../pages/admin/adminReportesHelpers";
import {
    agruparUsuariosPorEstado,
    agruparUsuariosPorRol,
    calcularResumenUsuarios,
} from "../../pages/superAdmin/superAdminReportesHelpers";

export const useSuperAdminReportes = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [docentes, setDocentes] = useState([]);
    const [productosRaw, setProductosRaw] = useState([]);
    const [taxonomia, setTaxonomia] = useState({ existe: true });
    const [auditoria, setAuditoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                usuariosData,
                docentesData,
                productosData,
                taxonomiaData,
                auditoriaData,
            ] = await Promise.all([
                getUsuarios(),
                getDocentes(),
                getAllProductos(),
                getTaxonomiaEstado().catch(() => ({ existe: true })),
                getAuditResumen().catch(() => null),
            ]);
            setUsuarios(usuariosData);
            setDocentes(docentesData);
            setProductosRaw(productosData);
            setTaxonomia(taxonomiaData);
            setAuditoria(auditoriaData);
        } catch (e) {
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "Error al cargar reportes del sistema");
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

    const resumenUsuarios = useMemo(
        () => calcularResumenUsuarios(usuarios),
        [usuarios],
    );

    const resumenProduccion = useMemo(
        () => calcularResumenProduccion(productos),
        [productos],
    );

    const cobertura = useMemo(
        () => calcularCoberturaDocente(docentes, productos),
        [docentes, productos],
    );

    const porAnio = useMemo(
        () => agruparPorAnio(productos),
        [productos],
    );

    const porCategoria = useMemo(
        () => agruparConteo(productos, (p) => p.categoria),
        [productos],
    );

    const usuariosPorRol = useMemo(
        () => agruparUsuariosPorRol(usuarios),
        [usuarios],
    );

    const usuariosPorEstado = useMemo(
        () => agruparUsuariosPorEstado(usuarios),
        [usuarios],
    );

    const kpis = useMemo(() => [
        { label: "Usuarios registrados", value: resumenUsuarios.total, icon: Users, accent: "bg-[#ffc20e]/15 text-[#EC7A21]" },
        { label: "Usuarios activos", value: resumenUsuarios.activos, icon: UserCheck, accent: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
        { label: "% Adopción docente", value: `${cobertura.porcentajeCobertura}%`, icon: Shield, accent: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" },
        { label: "Total productos", value: resumenProduccion.total, icon: BookOpen, accent: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
        { label: "Publicados", value: resumenProduccion.publicados, icon: Globe, accent: "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400" },
        { label: "Nuevos (30 días)", value: resumenProduccion.recientes, icon: Clock, accent: "bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20" },
    ], [resumenUsuarios, cobertura, resumenProduccion]);

    const auditoriaKpis = useMemo(() => auditoria ? [
        { label: "Eventos (hoy)", value: auditoria.eventosHoy, accent: "bg-[#ffc20e]/15 text-[#EC7A21]" },
        { label: "Críticos (7 días)", value: auditoria.criticos7Dias, accent: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
        { label: "Usuarios únicos (7 d)", value: auditoria.usuariosUnicos7Dias, accent: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
        { label: "Fallidos (hoy)", value: auditoria.fallidosHoy, accent: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
    ] : [], [auditoria]);

    const NOTA_ATRIBUCION =
        "La facultad de cada producto se infiere de los programas del docente autor. La adopción docente mide cuántos docentes tienen al menos un producto registrado.";

    return {
        loading,
        error,
        refetch: fetchData,
        resumenUsuarios,
        resumenProduccion,
        cobertura,
        porAnio,
        porCategoria,
        usuariosPorRol,
        usuariosPorEstado,
        auditoria,
        auditoriaKpis,
        kpis,
        notaAtribucion: NOTA_ATRIBUCION,
        taxonomiaPendiente: !taxonomia?.existe,
    };
};
