import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { ReporteChartCard } from "./ReporteChartCard";
import { CHART_COLORS } from "./chartTheme";

const TooltipPie = ({ active, payload, valorLabel = "Productos" }) => {
    if (!active || !payload?.length) return null;
    const { nombre, total, porcentaje } = payload[0].payload;
    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 shadow-md text-xs">
            <p className="font-semibold text-gray-900 dark:text-white">{nombre}</p>
            <p className="text-gray-600 dark:text-gray-300">
                {valorLabel}: <span className="font-medium">{total}</span> ({porcentaje}%)
            </p>
        </div>
    );
};

export const DistribucionPieChart = ({
    titulo,
    subtitulo,
    datos = [],
    loading = false,
    mensajeVacio = "Sin datos para mostrar",
    valorLabel = "Productos",
    altura = 280,
    compact = false,
}) => {
    const chartAltura = compact ? 220 : altura;
    const outerRadius = compact ? 58 : 90;
    const subtituloVisible = compact ? null : subtitulo;
    const totalGeneral = datos.reduce((acc, d) => acc + d.total, 0);
    const filas = datos.map((d, idx) => ({
        ...d,
        porcentaje: totalGeneral > 0 ? Math.round((d.total / totalGeneral) * 100) : 0,
        color: d.color ?? CHART_COLORS[idx % CHART_COLORS.length],
    }));

    return (
        <ReporteChartCard
            titulo={titulo}
            subtitulo={subtituloVisible}
            loading={loading}
            vacio={filas.length === 0 || totalGeneral === 0}
            mensajeVacio={mensajeVacio}
            altura={chartAltura}
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={filas}
                        dataKey="total"
                        nameKey="nombre"
                        cx="50%"
                        cy={compact ? "44%" : "48%"}
                        outerRadius={outerRadius}
                        paddingAngle={filas.length > 1 ? 2 : 0}
                    >
                        {filas.map((d) => (
                            <Cell key={d.key} fill={d.color} />
                        ))}
                    </Pie>
                    <Tooltip content={(props) => <TooltipPie {...props} valorLabel={valorLabel} />} />
                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (
                            <span className="text-xs text-gray-600 dark:text-gray-300">{value}</span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </ReporteChartCard>
    );
};
