import { useState, useEffect, useCallback, useMemo } from "react";
import { getMisProductos } from "../services/productoServices";
import { getMiPerfilDocente } from "../services/docenteService";
import { esReciente } from "../pages/docente/components/productoHelpers";

const LIMITE_RECIENTES = 5;

export const nombreDocente = (docente) => {
    if (!docente) return null;
    const nombre = [docente.nombre, docente.apellido].filter(Boolean).join(" ").trim();
    return nombre || null;
};

export const useDocenteDashboard = () => {
    const [productos, setProductos] = useState([]);
    const [docente, setDocente]     = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);

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
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "Error al cargar el dashboard");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const resumen = useMemo(() => ({
        total:         productos.length,
        publicados:    productos.filter((p) => p.publicado).length,
        sinPublicar:   productos.filter((p) => !p.publicado).length,
        ultimos30Dias: productos.filter((p) => esReciente(p.fechaRegistroSgpa)).length,
    }), [productos]);

    const recientes = useMemo(() =>
        [...productos]
            .sort((a, b) => new Date(b.fechaRegistroSgpa ?? 0) - new Date(a.fechaRegistroSgpa ?? 0))
            .slice(0, LIMITE_RECIENTES),
    [productos]);

    const porCategoria = useMemo(() => {
        const conteo = productos.reduce((acc, p) => {
            const cat = p.categoria ?? "SIN_CATEGORIA";
            acc[cat] = (acc[cat] ?? 0) + 1;
            return acc;
        }, {});
        return Object.entries(conteo)
            .map(([categoria, total]) => ({ categoria, total }))
            .sort((a, b) => b.total - a.total);
    }, [productos]);

    return {
        docente,
        nombreDocente: nombreDocente(docente),
        productos,
        resumen,
        recientes,
        porCategoria,
        loading,
        error,
        refetch: fetchData,
    };
};
