import axiosInstance from "./axiosInstance";

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: object }>}
 */
export const loginRequest = (credentials) =>
  axiosInstance.post("/auth/login", credentials);

/**
 * @param {{ nombre: string, apellido: string, email: string, password: string, rol: string }} data
 * @returns {Promise<{ token: string, user: object }>}
 */
export const registerRequest = (data) =>
  axiosInstance.post("/auth/register", data);
