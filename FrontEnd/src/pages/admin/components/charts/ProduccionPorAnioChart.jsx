import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { CAMPO_FECHA_PUBLICACION_SGPA } from "../../../docente/components/productoHelpers";
import { ReporteChartCard } from "./ReporteChartCard";
import { ReporteChartTooltip } from "./ReporteChartTooltip";
import { CHART_SECONDARY, CHART_AXIS, CHART_GRID } from "./chartTheme";

export const ProduccionPorAnioChart = ({ datos, loading, campoFecha, compact = false }) => {
    const filas = (datos ?? []).map((d) => ({
        anio: d.anio,
        total: d.total,
        etiqueta: d.anio,
    }));

    const subtitulo = campoFecha === CAMPO_FECHA_PUBLICACION_SGPA
        ? "Productos agrupados por año de publicación en SGPA"
        : "Productos agrupados por año de registro en SGPA";

    return (
        <ReporteChartCard
            titulo="Producción por año"
            subtitulo={compact ? null : subtitulo}
            loading={loading}
            vacio={filas.length === 0}
            mensajeVacio="No hay productos con fecha en el rango filtrado."
            altura={compact ? 220 : 280}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filas} margin={{ top: 8, right: 4, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} vertical={false} />
                    <XAxis dataKey="anio" tick={{ fill: CHART_AXIS, fontSize: compact ? 10 : 11 }} />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fill: CHART_AXIS, fontSize: compact ? 10 : 11 }}
                        width={compact ? 28 : 36}
                    />
                    <Tooltip content={<ReporteChartTooltip />} />
                    <Bar
                        dataKey="total"
                        name="Productos"
                        fill={CHART_SECONDARY}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={compact ? 32 : 48}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ReporteChartCard>
    );
};
