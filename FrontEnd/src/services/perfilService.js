import axiosInstance from "./axiosInstance";

/** GET /api/usuarios/perfil — perfil del usuario autenticado */
export const getMiPerfil = async () => {
    const { data } = await axiosInstance.get("/api/usuarios/perfil");
    return data;
};

/** PATCH /api/usuarios/perfil — actualiza datos personales */
export const actualizarMiPerfil = async (payload) => {
    const { data } = await axiosInstance.patch("/api/usuarios/perfil", payload);
    return data;
};

/** PATCH /api/usuarios/perfil/docente — tipo de contrato y código docente (si aún no está asignado) */
export const actualizarPerfilDocente = async (payload) => {
    const { data } = await axiosInstance.patch("/api/usuarios/perfil/docente", payload);
    return data;
};

/** PATCH /api/usuarios/perfil/docente/programas */
export const actualizarProgramasPerfil = async (payload) => {
    const { data } = await axiosInstance.patch("/api/usuarios/perfil/docente/programas", payload);
    return data;
};

/** PATCH /api/usuarios/perfil/administrativo — cargo y dependencia */
export const actualizarPerfilAdministrativo = async (payload) => {
    const { data } = await axiosInstance.patch("/api/usuarios/perfil/administrativo", payload);
    return data;
};

/** POST /api/usuarios/perfil/titulos */
export const agregarTituloPerfil = async (payload) => {
    const { data } = await axiosInstance.post("/api/usuarios/perfil/titulos", payload);
    return data;
};

/** DELETE /api/usuarios/perfil/titulos/{id} */
export const eliminarTituloPerfil = async (tituloId) => {
    const { data } = await axiosInstance.delete(`/api/usuarios/perfil/titulos/${tituloId}`);
    return data;
};

/** PATCH /api/usuarios/cambiar-password */
export const cambiarPassword = async (payload) => {
    await axiosInstance.patch("/api/usuarios/cambiar-password", payload);
};
