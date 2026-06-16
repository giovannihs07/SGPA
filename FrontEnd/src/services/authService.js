import axiosInstance from "./axiosInstance";

/**
 * @param {{ email: string, password: string }} credentials
 */
export const loginUser = (credentials) =>
    axiosInstance.post("/api/auth/login", credentials, { skipAuth: true });

/**
 * Solicita código de restablecimiento de contraseña.
 * POST /api/auth/forgot-password
 */
export const solicitarResetPassword = (email) =>
    axiosInstance.post("/api/auth/forgot-password", { email }, { skipAuth: true });

/**
 * Restablece contraseña con código.
 * POST /api/auth/reset-password
 */
export const restablecerPassword = ({ email, codigo, passwordNuevo, passwordConfirmacion }) =>
    axiosInstance.post(
        "/api/auth/reset-password",
        { email, codigo, passwordNuevo, passwordConfirmacion },
        { skipAuth: true },
    );

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
