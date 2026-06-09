import { DistribucionPieChart } from "./DistribucionPieChart";

const COLOR_PUBLICADO = "#22c55e";
const COLOR_SIN_PUBLICAR = "#f59e0b";

export const EstadoDistribucionChart = ({ resumen, loading, compact = false }) => {
    const datos = [
        {
            key: "publicado",
            nombre: compact ? "Publicado" : "Publicado en SGPA",
            total: resumen?.publicados ?? 0,
            color: COLOR_PUBLICADO,
        },
        {
            key: "sin_publicar",
            nombre: "Sin publicar",
            total: resumen?.sinPublicar ?? 0,
            color: COLOR_SIN_PUBLICAR,
        },
    ].filter((d) => d.total > 0);

    return (
        <DistribucionPieChart
            titulo="Distribución por estado"
            subtitulo="Publicados vs sin publicar en el alcance filtrado"
            datos={datos}
            loading={loading}
            compact={compact}
            mensajeVacio="No hay productos con los filtros actuales."
        />
    );
};
