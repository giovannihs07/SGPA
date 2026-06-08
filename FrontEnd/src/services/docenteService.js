import axiosInstance from "./axiosInstance";

/** GET /api/docentes */
export const getDocentes = async () => {
    const { data } = await axiosInstance.get("/api/docentes");
    return data;
};

/** GET /api/docentes/mi — perfil del docente autenticado */
export const getMiPerfilDocente = async () => {
    const { data } = await axiosInstance.get("/api/docentes/mi");
    return data;
};
