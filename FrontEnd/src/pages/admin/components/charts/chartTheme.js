export const CHART_PRIMARY = "#EC7A21";
export const CHART_SECONDARY = "#ffc20e";
export const CHART_COLORS = [
    "#EC7A21",
    "#ffc20e",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f59e0b",
];
export const CHART_AXIS = "#9ca3af";
export const CHART_GRID = "#e5e7eb";

export const truncarEtiqueta = (texto, max = 28) => {
    if (!texto || texto.length <= max) return texto ?? "—";
    return `${texto.slice(0, max)}…`;
};
