import { useState, useEffect } from "react";
import { getFacultades, getProgramasByFacultad } from "../services/programaService";

/**
 * Carga facultades del backend y programas bajo demanda por facultadId.
 * Devuelve un mapa programasPorFacultad: { [facultadId]: [{ id, nombre }] }
 * que se va poblando conforme el usuario elige facultades.
 */
export const useFacultadesProgramas = () => {
    const [facultades, setFacultades]               = useState([]);  // [{ id, nombre }]
    const [programasPorFacultad, setProgramasPorFacultad] = useState({}); // { facultadId: [{ id, nombre }] }
    const [loadingFacultades, setLoadingFacultades] = useState(true);
    const [errorFacultades, setErrorFacultades]     = useState(null);

    // Carga inicial de facultades
    useEffect(() => {
        getFacultades()
            .then(data => setFacultades(data))
            .catch(() => setErrorFacultades("No se pudieron cargar las facultades."))
            .finally(() => setLoadingFacultades(false));
    }, []);

    /**
     * Carga los programas de una facultad si aún no están en caché.
     * @param {number} facultadId
     */
    const cargarProgramas = async (facultadId) => {
        if (!facultadId || programasPorFacultad[facultadId]) return;
        try {
            const data = await getProgramasByFacultad(facultadId);
            setProgramasPorFacultad(prev => ({ ...prev, [facultadId]: data }));
        } catch {
            // Si falla, el select quedará vacío — el usuario puede reintentar
        }
    };

    const getProgramas = (facultadId) => programasPorFacultad[facultadId] ?? [];

    return { facultades, getProgramas, cargarProgramas, loadingFacultades, errorFacultades };
};
