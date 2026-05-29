import axiosInstance from "./axiosInstance";

/** GET /api/administrativos */
export const getAdministrativos = async () => {
    const { data } = await axiosInstance.get("/api/administrativos");
    return data;
};
