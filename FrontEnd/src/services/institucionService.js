import axiosInstance from "./axiosInstance";

// -- Instituciones -----------------------------

export const getInstituciones = async () => {
    const { data } = await axiosInstance.get("/api/instituciones");
    return data;
};

export const crearInstitucion = async (dto) => {
    const { data } = await axiosInstance.post("/api/instituciones", dto);
    return data;
};

export const actualizarInstitucion = async (id, dto) => {
    const { data } = await axiosInstance.put(`/api/instituciones/${id}`, dto);
    return data;
};

export const eliminarInstitucion = async (id) => {
    await axiosInstance.delete(`/api/instituciones/${id}`);
};

// -- Facultades ------------------------------------------------

export const getFacultades = async (institucionId = null) => {
    const params = institucionId ? { institucionId } : {};
    const { data } = await axiosInstance.get("/api/facultades", { params });
    return data;
};

export const crearFacultad = async (dto) => {
    const { data } = await axiosInstance.post("/api/facultades", dto);
    return data;
};

export const actualizarFacultad = async (id, dto) => {
    const { data } = await axiosInstance.put(`/api/facultades/${id}`, dto);
    return data;
};

export const eliminarFacultad = async (id) => {
    await axiosInstance.delete(`/api/facultades/${id}`);
};

// -- Programas ------------------------------------------------

export const getProgramas = async (params = {}) => {
    const { data } = await axiosInstance.get("/api/programas", { params });
    return data;
};

export const getNivelesFormacion = async () => {
    const { data } = await axiosInstance.get("/api/programas/niveles");
    return data;
};

export const crearPrograma = async (dto) => {
    const { data } = await axiosInstance.post("/api/programas", dto);
    return data;
};

export const actualizarPrograma = async (id, dto) => {
    const { data } = await axiosInstance.put(`/api/programas/${id}`, dto);
    return data;
};

export const eliminarPrograma = async (id) => {
    await axiosInstance.delete(`/api/programas/${id}`);
};
