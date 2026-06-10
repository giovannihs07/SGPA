import { Calendar } from "lucide-react";
import { SelectFilter } from "../../pages/docente/components/misProductos/SelectFilter";
import {
    CAMPO_FECHA_REGISTRO_SGPA,
    CAMPO_FECHA_PUBLICACION_SGPA,
} from "../../pages/docente/components/productoHelpers";
import { inputXs } from "./themeTokens";

export const FiltroFechaRango = ({
    fechaDesde,
    fechaHasta,
    onDesdeChange,
    onHastaChange,
    filtroCampo,
    onCampoChange,
    mostrarSelectorCampo = true,
    className = "",
}) => (
    <div className={`inline-flex flex-nowrap items-center gap-2 shrink-0 ${className}`}>
        <Calendar size={13} className="text-gray-500 dark:text-gray-400 shrink-0" aria-hidden="true" />
        {mostrarSelectorCampo && onCampoChange && (
            <div className="shrink-0 [&_select]:w-auto! [&_select]:min-w-44">
                <SelectFilter value={filtroCampo} onChange={onCampoChange} aria-label="Filtrar por tipo de fecha">
                    <option value={CAMPO_FECHA_REGISTRO_SGPA}>Registrado en SGPA</option>
                    <option value={CAMPO_FECHA_PUBLICACION_SGPA}>Publicado en SGPA</option>
                </SelectFilter>
            </div>
        )}
        <input
            type="date"
            value={fechaDesde}
            onChange={(e) => onDesdeChange(e.target.value)}
            aria-label="Fecha desde"
            className={`${inputXs} w-auto! shrink-0 min-w-38`}
        />
        <span className="text-xs text-gray-400 shrink-0">—</span>
        <input
            type="date"
            value={fechaHasta}
            onChange={(e) => onHastaChange(e.target.value)}
            aria-label="Fecha hasta"
            min={fechaDesde || undefined}
            className={`${inputXs} w-auto! shrink-0 min-w-38`}
        />
    </div>
);
