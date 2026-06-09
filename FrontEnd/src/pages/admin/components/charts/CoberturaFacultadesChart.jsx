import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { ReporteChartCard } from "./ReporteChartCard";
import { ReporteChartTooltip } from "./ReporteChartTooltip";
import { CHART_PRIMARY, CHART_AXIS, CHART_GRID, truncarEtiqueta } from "./chartTheme";

const prepararDatos = (filas) =>
    filas
        .filter((f) => f.totalDocentes > 0)
        .sort((a, b) => a.porcentajeCobertura - b.porcentajeCobertura)
        .slice(-8)
        .map((f) => ({
            nombre: truncarEtiqueta(f.nombre),
            nombreCompleto: f.nombre,
            cobertura: f.porcentajeCobertura,
            conProduccion: f.docentesConProduccion,
            totalDocentes: f.totalDocentes,
        }));

export const CoberturaFacultadesChart = ({ filas, loading }) => {
    const datos = prepararDatos(filas ?? []);
    const altura = Math.max(220, datos.length * 36 + 48);

    return (
        <ReporteChartCard
            titulo="Cobertura docente por facultad"
            subtitulo="% de docentes con al menos un producto en el periodo filtrado"
            loading={loading}
            vacio={datos.length === 0}
            mensajeVacio="No hay docentes vinculados a facultades en el alcance actual."
            altura={altura}
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} horizontal={false} />
                    <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fill: CHART_AXIS, fontSize: 11 }}
                        tickFormatter={(v) => `${v}%`}
                    />
                    <YAxis
                        type="category"
                        dataKey="nombre"
                        width={120}
                        tick={{ fill: CHART_AXIS, fontSize: 11 }}
                    />
                    <Tooltip content={<ReporteChartTooltip />} />
                    <Bar
                        dataKey="cobertura"
                        name="Cobertura"
                        fill={CHART_PRIMARY}
                        radius={[0, 4, 4, 0]}
                        maxBarSize={20}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ReporteChartCard>
    );
};
