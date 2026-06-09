import { DistribucionPieChart } from "../../../admin/components/charts/DistribucionPieChart";

const COLOR_ESTADO = {
    ACTIVO: "#22c55e",
    INACTIVO: "#9ca3af",
    PENDIENTE: "#f59e0b",
    RECHAZADO: "#ef4444",
};

export const UsuariosPorEstadoChart = ({ items, loading, compact = false }) => {
    const datos = (items ?? []).map((item) => ({
        key: item.key,
        nombre: item.label,
        total: item.count,
        color: COLOR_ESTADO[item.key] ?? "#6b7280",
    }));

    return (
        <DistribucionPieChart
            titulo="Usuarios por estado"
            subtitulo="Distribución de cuentas según su estado en el sistema"
            datos={datos}
            loading={loading}
            compact={compact}
            mensajeVacio="No hay usuarios registrados."
        />
    );
};
