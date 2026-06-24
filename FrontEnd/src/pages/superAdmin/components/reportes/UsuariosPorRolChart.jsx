import { DistribucionPieChart } from "../../../admin/components/charts/DistribucionPieChart";
import { CHART_COLORS } from "../../../admin/components/charts/chartTheme";

export const UsuariosPorRolChart = ({ items, loading, compact = false }) => {
    const datos = (items ?? []).map((item, idx) => ({
        key: item.key,
        nombre: item.label,
        total: item.count,
        color: CHART_COLORS[idx % CHART_COLORS.length],
    }));

    return (
        <DistribucionPieChart
            titulo="Usuarios por rol"
            subtitulo="Conteo por rol asignado (un usuario puede tener varios)"
            datos={datos}
            loading={loading}
            compact={compact}
            valorLabel="Total"
            mensajeVacio="No hay usuarios con roles registrados."
        />
    );
};
