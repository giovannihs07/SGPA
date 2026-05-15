import axiosInstance from "./axiosInstance";

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: object }>}
 */
export const loginUser = (credentials) =>
  axiosInstance.post("/login", credentials);

/**
 * @param {{ nombre: string, apellido: string, email: string, password: string, rol: string }} data
 * @returns {Promise<{ token: string, user: object }>}
 */
export const registerUser = (data) =>
  axiosInstance.post("/register", data);

