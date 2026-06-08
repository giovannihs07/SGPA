import { useState, useEffect, useCallback, useMemo } from "react";
import { Users, UserCheck, BookOpen, Clock } from "lucide-react";
import { getUsuarios } from "../../services/usuarioService";
import { getProductosPublicados } from "../../services/productoServices";
import { getTaxonomiaEstado } from "../../services/taxonomiaService";
import { esReciente } from "../../pages/docente/components/productoHelpers";

export const useSuperAdminDashboard = () => {
    const [stats, setStats]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [usuarios, productos, taxonomia] = await Promise.all([
                getUsuarios(),
                getProductosPublicados(),
                getTaxonomiaEstado().catch(() => ({ existe: true })),
            ]);
            setStats({
                totalUsuarios:       usuarios.length,
                usuariosActivos:     usuarios.filter((u) => u.estado === "ACTIVO").length,
                productosPublicados: productos.length,
                productosRecientes:  productos.filter((p) => esReciente(p.fechaRegistroSgpa)).length,
                taxonomiaPendiente:  !taxonomia.existe,
            });
        } catch (e) {
            setError(e.response?.data?.error ?? e.message ?? "Error al cargar estadísticas");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    const kpis = useMemo(() => stats ? [
        { label: "Usuarios registrados", value: stats.totalUsuarios,    icon: Users,    accent: "bg-[#ffc20e]/15 text-[#EC7A21]" },
        { label: "Usuarios activos",     value: stats.usuariosActivos,  icon: UserCheck, accent: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" },
        { label: "Productos publicados", value: stats.productosPublicados, icon: BookOpen, accent: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" },
        { label: "Publicados (30 días)", value: stats.productosRecientes, icon: Clock, accent: "bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20" },
    ] : [], [stats]);

    return { stats, kpis, loading, error, refetch: fetchStats };
};
