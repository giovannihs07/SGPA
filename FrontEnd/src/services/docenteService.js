import axiosInstance from "./axiosInstance";

/** GET /api/docentes */
export const getDocentes = async () => {
    const { data } = await axiosInstance.get("/api/docentes");
    return data;
};
