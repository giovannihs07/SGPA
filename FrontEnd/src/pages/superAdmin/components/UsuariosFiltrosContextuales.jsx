import { selectSm, filtroCampoIgual } from "../../../components/ui/themeTokens";
import {
    perfilRequiereFiltroDocente,
    perfilRequiereFiltroAdministrativo,
} from "../superAdminHelpers";

export const UsuariosFiltrosContextuales = ({
    filtroPerfil,
    filtroFacultad,
    setFiltroFacultad,
    facultades,
    filtroPrograma,
    setFiltroPrograma,
    programasFiltrados,
    filtroDependencia,
    setFiltroDependencia,
    dependencias,
}) => {
    const showDocente = perfilRequiereFiltroDocente(filtroPerfil);
    const showAdmin = perfilRequiereFiltroAdministrativo(filtroPerfil);

    if (!showDocente && !showAdmin) return null;

    return (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full">
            {showDocente && (
                <>
                    <select
                        value={filtroFacultad}
                        onChange={(e) => setFiltroFacultad(e.target.value)}
                        aria-label="Filtrar por facultad"
                        className={`${selectSm} ${filtroCampoIgual}`}
                    >
                        <option value="TODAS">Todas las facultades</option>
                        {facultades.map((f) => (
                            <option key={f.id} value={f.id}>{f.nombre}</option>
                        ))}
                    </select>
                    <select
                        value={filtroPrograma}
                        onChange={(e) => setFiltroPrograma(e.target.value)}
                        aria-label="Filtrar por programa"
                        className={`${selectSm} ${filtroCampoIgual}`}
                    >
                        <option value="TODOS">Todos los programas</option>
                        {programasFiltrados.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </>
            )}
            {showAdmin && (
                <select
                    value={filtroDependencia}
                    onChange={(e) => setFiltroDependencia(e.target.value)}
                    aria-label="Filtrar por dependencia"
                    className={`${selectSm} ${filtroCampoIgual}`}
                >
                    <option value="TODAS">Todas las dependencias</option>
                    {dependencias.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            )}
        </div>
    );
};
