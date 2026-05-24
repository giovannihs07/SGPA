import axiosInstance from "./axiosInstance";

/**
 * @param {{ email: string, password: string }} credentials
 */
export const loginUser = (credentials) =>
    axiosInstance.post("/api/auth/login", credentials);

/**
 * Registro exclusivo de docente.
 * POST /api/docentes/registro
 * @param {RegistroDocenteRequest} data
 */
export const registerDocente = (data) =>
    axiosInstance.post("/api/docentes/registro", data);

/**
 * Registro exclusivo de administrativo.
 * POST /api/administrativos/registro
 * @param {RegistroAdministrativoRequest} data
 */
export const registerAdministrativo = (data) =>
    axiosInstance.post("/api/administrativos/registro", data);

/**
 * Registro de docente que también es administrativo.
 * POST /api/docentes/registro-docente-admin
 * @param {RegistroDocenteAdminRequest} data
 */
export const registerDocenteAdmin = (data) =>
    axiosInstance.post("/api/docentes/registro-docente-admin", data);
