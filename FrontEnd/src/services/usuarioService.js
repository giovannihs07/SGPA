import axiosInstance from "./axiosInstance";

export const getUsuarios = async () => {
    const { data } = await axiosInstance.get("/api/usuarios");
    return data;
};

export const getUsuariosPendientes = async () => {
    const { data } = await axiosInstance.get("/api/usuarios/pendientes");
    return data;
};

// Función para activar un usuario (reactivar sin cambiar roles)
export const activarUsuario = async (userId) => {
    await axiosInstance.patch(`/api/usuarios/${userId}/activar`);
};

/** Aprueba un usuario pendiente y asigna roles en una sola operación */
export const aprobarUsuario = async (userId, roles) => {
    await axiosInstance.patch(`/api/usuarios/${userId}/aprobar`, {
        roles: Array.isArray(roles) ? roles : [...roles],
    });
};

export const desactivarUsuario = async (userId) => {
    await axiosInstance.patch(`/api/usuarios/${userId}/desactivar`);
};

export const rechazarUsuario = async (userId) => {
    await axiosInstance.patch(`/api/usuarios/${userId}/rechazar`);
};

export const cambiarRolesUsuario = async (userId, roles) => {
    await axiosInstance.patch(`/api/usuarios/${userId}/roles`, {
        roles: Array.isArray(roles) ? roles : [...roles],
    });
};

export const getRolesDisponibles = async () => {
    const { data } = await axiosInstance.get("/api/roles/disponibles");
    return data;
};
