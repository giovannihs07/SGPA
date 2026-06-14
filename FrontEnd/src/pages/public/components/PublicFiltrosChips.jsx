import { X } from "lucide-react";
import {
    CATEGORIA_LABELS,
    TIPO_LABELS,
    CAMPO_FECHA_PUBLICACION_SGPA,
} from "../../docente/components/productoHelpers";

const Chip = ({ label, onRemove }) => (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium
        bg-[#ffc20e]/15 text-[#222222] dark:text-[#ffc20e] border border-[#ffc20e]/30">
        {label}
        <button
            type="button"
            onClick={onRemove}
            aria-label={`Quitar filtro: ${label}`}
            className="w-5 h-5 flex items-center justify-center rounded-full
                hover:bg-[#EC7A21]/20 hover:text-[#EC7A21] transition"
        >
            <X size={12} />
        </button>
    </span>
);

const formatFechaChip = (fecha) => {
    if (!fecha) return "…";
    const [y, m, d] = fecha.split("-");
    return `${d}/${m}/${y}`;
};

export const PublicFiltrosChips = ({
    busqueda,
    setBusqueda,
    filtroCategoria,
    handleFiltroCategoria,
    filtroTipo,
    setFiltroTipo,
    fechaDesde,
    fechaHasta,
    setFechaDesde,
    setFechaHasta,
    filtroCampoFecha,
    limpiarFiltros,
    hayFiltrosActivos,
}) => {
    if (!hayFiltrosActivos) return null;

    const chips = [];

    if (busqueda.trim()) {
        chips.push({
            key: "q",
            label: `Búsqueda: "${busqueda.trim()}"`,
            onRemove: () => setBusqueda(""),
        });
    }

    if (filtroCategoria !== "TODAS") {
        chips.push({
            key: "categoria",
            label: CATEGORIA_LABELS[filtroCategoria] ?? filtroCategoria,
            onRemove: () => handleFiltroCategoria("TODAS"),
        });
    }

    if (filtroTipo !== "TODOS") {
        chips.push({
            key: "tipo",
            label: TIPO_LABELS[filtroTipo] ?? filtroTipo,
            onRemove: () => setFiltroTipo("TODOS"),
        });
    }

    if (fechaDesde || fechaHasta) {
        const campoLabel = filtroCampoFecha === CAMPO_FECHA_PUBLICACION_SGPA
            ? "Publicado"
            : "Registrado";
        chips.push({
            key: "fecha",
            label: `${campoLabel}: ${formatFechaChip(fechaDesde)} — ${formatFechaChip(fechaHasta)}`,
            onRemove: () => {
                setFechaDesde("");
                setFechaHasta("");
            },
        });
    }

    return (
        <div className="flex flex-wrap items-center gap-2" role="list" aria-label="Filtros activos">
            {chips.map((chip) => (
                <Chip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
            ))}
            {chips.length > 1 && (
                <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="text-xs font-medium text-gray-500 dark:text-gray-400
                        hover:text-red-600 dark:hover:text-red-400 transition ml-1"
                >
                    Limpiar todo
                </button>
            )}
        </div>
    );
};
