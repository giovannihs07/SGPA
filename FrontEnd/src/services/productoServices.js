
import axiosInstance from "./axiosInstance";

/**
 * GET /api/productos/tipos
 * Devuelve: { SUBCATEGORIA: { TIPO: [atributos...] } }
 */
export const getTiposProducto = async () => {
    const { data } = await axiosInstance.get("/api/productos/tipos");
    return data;
};

/**
 * POST /api/productos  (multipart/form-data)
 *   - parte "datos"   → Blob JSON  (@RequestPart Spring)
 *   - parte "archivo" → File opcional
 *
 */
export const crearProducto = async (datos, archivo = null) => {
    const formData = new FormData();

    formData.append(
        "datos",
        new Blob([JSON.stringify(datos)], { type: "application/json" })
    );

    if (archivo) {
        formData.append("archivo", archivo);
    }

    const { data } = await axiosInstance.post(
        "/api/productos",
        formData
    );

    return data;
};

/**
 * GET /api/productos?docenteId=X
 */
export const getProductosDocente = async (docenteId) => {
    const { data } = await axiosInstance.get("/api/productos", {
        params: { docenteId },
    });
    return data;
};

/**
 * GET /api/productos?docenteId=X&page=0&size=10
 */
export const getProductosDocentePaginado = async (docenteId, page = 0, size = 10) => {
    const { data } = await axiosInstance.get("/api/productos", {
        params: { docenteId, page, size },
    });
    return data;
};

/**
 * GET /api/productos/:id
 */
export const getProductoPorId = async (id) => {
    const { data } = await axiosInstance.get(`/api/productos/${id}`);
    return data;
};

/**
 * PUT /api/productos/:id  (body JSON)
 */
export const actualizarProducto = async (id, datos) => {
    const { data } = await axiosInstance.put(`/api/productos/${id}`, datos);
    return data;
};

/**
 * DELETE /api/productos/:id
 */
export const eliminarProducto = async (id) => {
    await axiosInstance.delete(`/api/productos/${id}`);
};

/**
 * GET /api/productos/:id/archivo  (descarga)
 * Devuelve un blob para que el componente genere un link de descarga.
 */
export const descargarArchivo = async (id, nombreOriginal) => {
    const response = await axiosInstance.get(`/api/productos/${id}/archivo`, {
        responseType: "blob",
    });
    const url = URL.createObjectURL(response.data);
    const a   = document.createElement("a");
    a.href    = url;
    a.download = nombreOriginal;
    a.click();
    URL.revokeObjectURL(url);
};