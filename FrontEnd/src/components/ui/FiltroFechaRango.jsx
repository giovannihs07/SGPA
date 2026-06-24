import { Calendar } from "lucide-react";
import { SelectFilter } from "../../pages/docente/components/misProductos/SelectFilter";
import {
    CAMPO_FECHA_REGISTRO_SGPA,
    CAMPO_FECHA_PUBLICACION_SGPA,
} from "../../pages/docente/components/productoHelpers";
import { inputXs, text, filtroGrupo } from "./themeTokens";

const ControlesFecha = ({
    fechaDesde,
    fechaHasta,
    onDesdeChange,
    onHastaChange,
    filtroCampo,
    onCampoChange,
    mostrarSelectorCampo,
    mostrarIcono = true,
}) => (
    <>
        {mostrarIcono && (
            <Calendar size={13} className="text-gray-500 dark:text-gray-400 shrink-0" aria-hidden="true" />
        )}
        {mostrarSelectorCampo && onCampoChange && (
            <div className="shrink-0 [&_select]:w-auto! [&_select]:min-w-44">
                <SelectFilter
                    value={filtroCampo}
                    onChange={onCampoChange}
                    aria-label="Tipo de fecha para el rango"
                >
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
        <span className={`text-xs shrink-0 ${text.muted}`}>—</span>
        <input
            type="date"
            value={fechaHasta}
            onChange={(e) => onHastaChange(e.target.value)}
            aria-label="Fecha hasta"
            min={fechaDesde || undefined}
            className={`${inputXs} w-auto! shrink-0 min-w-38`}
        />
    </>
);

export const FiltroFechaRango = ({
    fechaDesde,
    fechaHasta,
    onDesdeChange,
    onHastaChange,
    filtroCampo,
    onCampoChange,
    mostrarSelectorCampo = true,
    agrupado = true,
    className = "",
}) => {
    const usarGrupo = mostrarSelectorCampo && onCampoChange && agrupado;

    if (usarGrupo) {
        return (
            <fieldset className={`${filtroGrupo} ${className}`}>
                <legend className={`text-[10px] font-bold uppercase tracking-widest ${text.muted} px-1`}>
                    Rango de fechas
                </legend>
                <div className="flex flex-wrap items-center gap-2">
                    <ControlesFecha
                        fechaDesde={fechaDesde}
                        fechaHasta={fechaHasta}
                        onDesdeChange={onDesdeChange}
                        onHastaChange={onHastaChange}
                        filtroCampo={filtroCampo}
                        onCampoChange={onCampoChange}
                        mostrarSelectorCampo={mostrarSelectorCampo}
                        mostrarIcono={false}
                    />
                </div>
            </fieldset>
        );
    }

    return (
        <div className={`inline-flex flex-nowrap items-center gap-2 shrink-0 ${className}`}>
            <ControlesFecha
                fechaDesde={fechaDesde}
                fechaHasta={fechaHasta}
                onDesdeChange={onDesdeChange}
                onHastaChange={onHastaChange}
                filtroCampo={filtroCampo}
                onCampoChange={onCampoChange}
                mostrarSelectorCampo={mostrarSelectorCampo}
            />
        </div>
    );
};
