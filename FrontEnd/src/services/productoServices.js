
import axiosInstance from "./axiosInstance";
import { getApiErrorMessageAsync } from "../utils/apiError";

/**
 * GET /api/productos/schema
 * Categorías → subcategorías → tipos → atributos (solo activos).
 */
export const getProductoSchema = async () => {
    const { data } = await axiosInstance.get("/api/productos/schema");
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
 * GET /api/productos  (listado global — admin/superadmin)
 */
export const getAllProductos = async (params = {}) => {
    const { data } = await axiosInstance.get("/api/productos", { params });
    return data;
};

/**
 * GET /api/productos?publicado=true  (solo productos publicados por docentes)
 */
export const getProductosPublicados = async () => {
    const { data } = await axiosInstance.get("/api/productos", {
        params: { publicado: true },
    });
    return data;
};

/**
 * GET /api/productos/mis  (docente autenticado vía JWT)
 */
export const getMisProductos = async () => {
    const { data } = await axiosInstance.get("/api/productos/mis");
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
 * GET /api/productos/mis/:id  (solo productos del docente autenticado)
 */
export const getMiProductoPorId = async (id) => {
    const { data } = await axiosInstance.get(`/api/productos/mis/${id}`);
    return data;
};

/**
 * PUT /api/productos/mis/:id  (multipart: datos + archivo opcional)
 */
export const actualizarMiProducto = async (id, datos, archivo = null) => {
    const formData = new FormData();
    formData.append(
        "datos",
        new Blob([JSON.stringify(datos)], { type: "application/json" }),
    );
    if (archivo) formData.append("archivo", archivo);

    const { data } = await axiosInstance.put(`/api/productos/mis/${id}`, formData);
    return data;
};

/**
 * PUT /api/productos/:id  (body JSON) — uso administrativo
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
    let response;
    try {
        response = await axiosInstance.get(`/api/productos/${id}/archivo`, {
            responseType: "blob",
            skipAuth: true,
        });
    } catch (error) {
        const message = await getApiErrorMessageAsync(
            error,
            "No se pudo descargar el archivo",
        );
        throw new Error(message);
    }

    const blob = response.data;

    if (blob.type?.includes("application/json")) {
        const message = await getApiErrorMessageAsync(
            { response: { data: blob } },
            "No se pudo descargar el archivo",
        );
        throw new Error(message);
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreOriginal || `producto-${id}`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};