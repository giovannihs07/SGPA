import { DistribucionPieChart } from "./DistribucionPieChart";

export const CategoriaDistribucionChart = ({ items, labelFn, loading, compact = false }) => {
    const datos = (items ?? []).map((item) => ({
        key: item.key,
        nombre: labelFn(item.key),
        total: item.count,
    }));

    return (
        <DistribucionPieChart
            titulo="Distribución por categoría"
            subtitulo="Composición de la producción filtrada"
            datos={datos}
            loading={loading}
            compact={compact}
            mensajeVacio="No hay productos por categoría con los filtros actuales."
        />
    );
};
