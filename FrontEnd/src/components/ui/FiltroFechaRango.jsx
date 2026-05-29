import { Calendar } from "lucide-react";
import { SelectFilter } from "../../pages/docente/components/misProductos/SelectFilter";
import { inputXs } from "./themeTokens";

export const FiltroFechaRango = ({
    fechaDesde,
    fechaHasta,
    onDesdeChange,
    onHastaChange,
    filtroCampo,
    onCampoChange,
    mostrarSelectorCampo = true,
}) => (
    <div className="flex items-center gap-2 flex-wrap">
        <Calendar size={13} className="text-gray-500 dark:text-gray-400 shrink-0" aria-hidden="true" />
        {mostrarSelectorCampo && onCampoChange && (
            <SelectFilter value={filtroCampo} onChange={onCampoChange} aria-label="Filtrar por tipo de fecha">
                <option value="fechaCreacion">Fecha creación</option>
                <option value="fechaPublicacion">Fecha publicación</option>
            </SelectFilter>
        )}
        <input
            type="date"
            value={fechaDesde}
            onChange={(e) => onDesdeChange(e.target.value)}
            aria-label="Fecha desde"
            className={`${inputXs} w-auto`}
        />
        <span className="text-xs text-gray-400">—</span>
        <input
            type="date"
            value={fechaHasta}
            onChange={(e) => onHastaChange(e.target.value)}
            aria-label="Fecha hasta"
            min={fechaDesde || undefined}
            className={`${inputXs} w-auto`}
        />
    </div>
);
