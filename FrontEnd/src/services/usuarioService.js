import axiosInstance from "./axiosInstance";

export const getUsuarios = async () => {
    const { data } = await axiosInstance.get("/api/usuarios");
    return data;
};

export const activarUsuario = async (userId) => {
    await axiosInstance.patch(`/api/usuarios/${userId}/activar`);
};

export const desactivarUsuario = async (userId) => {
    await axiosInstance.patch(`/api/usuarios/${userId}/desactivar`);
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
