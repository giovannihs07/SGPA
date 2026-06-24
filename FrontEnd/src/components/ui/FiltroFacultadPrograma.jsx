import { SelectFilter } from "../../pages/docente/components/misProductos/SelectFilter";
import { text, filtroGrupo } from "./themeTokens";

export const FiltroFacultadPrograma = ({
    filtroFacultad,
    onFacultadChange,
    filtroPrograma,
    onProgramaChange,
    facultades = [],
    programasFiltrados = [],
    agrupado = true,
    className = "",
}) => {
    const controles = (
        <>
            <div className="shrink-0 [&_select]:w-auto! [&_select]:min-w-44">
                <SelectFilter
                    value={filtroFacultad}
                    onChange={onFacultadChange}
                    aria-label="Filtrar por facultad"
                >
                    <option value="TODAS">Todas las facultades</option>
                    {facultades.map((f) => (
                        <option key={f.id} value={f.id}>{f.nombre}</option>
                    ))}
                </SelectFilter>
            </div>
            <div className="shrink-0 [&_select]:w-auto! [&_select]:min-w-44">
                <SelectFilter
                    value={filtroPrograma}
                    onChange={onProgramaChange}
                    aria-label="Filtrar por programa"
                >
                    <option value="TODOS">Todos los programas</option>
                    {programasFiltrados.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                </SelectFilter>
            </div>
        </>
    );

    if (!agrupado) {
        return (
            <div className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
                {controles}
            </div>
        );
    }

    return (
        <fieldset className={`${filtroGrupo} ${className}`}>
            <legend className={`text-[10px] font-bold uppercase tracking-widest ${text.muted} px-1`}>
                Facultad y programa
            </legend>
            <div className="flex flex-wrap items-center gap-2">
                {controles}
            </div>
        </fieldset>
    );
};
