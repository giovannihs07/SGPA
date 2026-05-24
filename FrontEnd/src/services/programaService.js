import axiosInstance from "./axiosInstance";

/** GET /api/facultades → [{ id, nombre, codigo, ... }] */
export const getFacultades = () =>
    axiosInstance.get("/api/facultades").then(r => r.data);

/** GET /api/programas?facultadId={id} → [{ id, nombre, nivel, facultadId, ... }] */
export const getProgramasByFacultad = (facultadId) =>
    axiosInstance.get("/api/programas", { params: { facultadId } }).then(r => r.data);
