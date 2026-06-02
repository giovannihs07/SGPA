import axiosInstance from "./axiosInstance";

// ── Estado y seed ─────────────────────────────────────────────

export const getTaxonomiaEstado = async () => {
    const { data } = await axiosInstance.get("/api/taxonomia/estado");
    return data;
};

export const cargarTaxonomiaPredeterminada = async () => {
    const { data } = await axiosInstance.post("/api/taxonomia/seed");
    return data;
};

// ── Categorías ────────────────────────────────────────────────

export const getCategorias = async (soloActivas = false) => {
    const { data } = await axiosInstance.get("/api/categorias", {
        params: { soloActivas },
    });
    return data;
};

export const crearCategoria = async (dto) => {
    const { data } = await axiosInstance.post("/api/categorias", dto);
    return data;
};

export const actualizarCategoria = async (id, dto) => {
    const { data } = await axiosInstance.put(`/api/categorias/${id}`, dto);
    return data;
};

export const activarCategoria = async (id) => {
    await axiosInstance.patch(`/api/categorias/${id}/activar`);
};

export const desactivarCategoria = async (id) => {
    await axiosInstance.patch(`/api/categorias/${id}/desactivar`);
};

export const eliminarCategoria = async (id) => {
    await axiosInstance.delete(`/api/categorias/${id}`);
};

// ── Subcategorías ───────────────────────────────────────────

export const getSubcategorias = async (categoriaId = null) => {
    const params = { soloActivas: false };
    if (categoriaId) params.categoriaId = categoriaId;
    const { data } = await axiosInstance.get("/api/subcategorias", { params });
    return data;
};

export const crearSubcategoria = async (dto) => {
    const { data } = await axiosInstance.post("/api/subcategorias", dto);
    return data;
};

export const actualizarSubcategoria = async (id, dto) => {
    const { data } = await axiosInstance.put(`/api/subcategorias/${id}`, dto);
    return data;
};

export const activarSubcategoria = async (id) => {
    await axiosInstance.patch(`/api/subcategorias/${id}/activar`);
};

export const desactivarSubcategoria = async (id) => {
    await axiosInstance.patch(`/api/subcategorias/${id}/desactivar`);
};

export const eliminarSubcategoria = async (id) => {
    await axiosInstance.delete(`/api/subcategorias/${id}`);
};

// ── Tipos de producto ─────────────────────────────────────────

export const getTiposProductoAdmin = async (subcategoriaId = null) => {
    const params = { soloActivos: false };
    if (subcategoriaId) params.subcategoriaId = subcategoriaId;
    const { data } = await axiosInstance.get("/api/tipos-producto", { params });
    return data;
};

export const getTipoProducto = async (id) => {
    const { data } = await axiosInstance.get(`/api/tipos-producto/${id}`);
    return data;
};

export const crearTipoProducto = async (dto) => {
    const { data } = await axiosInstance.post("/api/tipos-producto", dto);
    return data;
};

export const actualizarTipoProducto = async (id, dto) => {
    const { data } = await axiosInstance.put(`/api/tipos-producto/${id}`, dto);
    return data;
};

export const activarTipoProducto = async (id) => {
    await axiosInstance.patch(`/api/tipos-producto/${id}/activar`);
};

export const desactivarTipoProducto = async (id) => {
    await axiosInstance.patch(`/api/tipos-producto/${id}/desactivar`);
};

export const eliminarTipoProducto = async (id) => {
    await axiosInstance.delete(`/api/tipos-producto/${id}`);
};
