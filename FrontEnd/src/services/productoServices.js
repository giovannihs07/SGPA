
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

const appendArchivos = (formData, archivos = []) => {
    if (!archivos?.length) return;
    archivos.forEach((file) => {
        if (file) formData.append("archivos", file);
    });
};

/**
 * POST /api/productos  (multipart/form-data)
 *   - parte "datos"    → Blob JSON
 *   - parte "archivos" → File[] (metadatos en datos.archivosMeta)
 */
export const crearProducto = async (datos, archivos = []) => {
    const formData = new FormData();
    formData.append(
        "datos",
        new Blob([JSON.stringify(datos)], { type: "application/json" }),
    );
    appendArchivos(formData, archivos);

    const { data } = await axiosInstance.post("/api/productos", formData);
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
 * GET /api/productos/publicos  (catálogo publicado — admin/superadmin autenticados)
 */
export const getProductosPublicados = async () => {
    const { data } = await axiosInstance.get("/api/productos/publicos");
    return data;
};

/**
 * GET /api/productos/publicos  (portal público anónimo)
 */
export const getProductosPublicos = async () => {
    const { data } = await axiosInstance.get("/api/productos/publicos", { skipAuth: true });
    return data;
};

/**
 * GET /api/productos/publicos/:id  (detalle publicado — portal anónimo)
 */
export const getProductoPublicoPorId = async (id) => {
    const { data } = await axiosInstance.get(`/api/productos/publicos/${id}`, { skipAuth: true });
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
 * PUT /api/productos/mis/:id  (multipart: datos + archivos nuevos opcionales)
 */
export const actualizarMiProducto = async (id, datos, archivos = []) => {
    const formData = new FormData();
    formData.append(
        "datos",
        new Blob([JSON.stringify(datos)], { type: "application/json" }),
    );
    appendArchivos(formData, archivos);

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

const descargarBlob = (blob, nombreDescarga) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreDescarga;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

const fetchArchivoBlob = async (url, options = {}) => {
    let response;
    try {
        response = await axiosInstance.get(url, {
            responseType: "blob",
            ...options,
        });
    } catch (error) {
        const message = await getApiErrorMessageAsync(error, "No se pudo descargar el archivo");
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
    return blob;
};

/**
 * PATCH /api/productos/{id}/publicar
 * @param {Array<{archivoId: number, accesoPublico: boolean}>} archivosVisibilidad
 */
export const publicarProducto = async (id, archivosVisibilidad) => {
    const { data } = await axiosInstance.patch(`/api/productos/${id}/publicar`, {
        archivosVisibilidad,
    });
    return data;
};

export const despublicarProducto = async (id) => {
    const { data } = await axiosInstance.patch(`/api/productos/${id}/despublicar`);
    return data;
};

/** Descarga archivo principal (compatibilidad / público). */
export const descargarArchivo = async (productoId, nombreOriginal) => {
    const blob = await fetchArchivoBlob(`/api/productos/${productoId}/archivo`, { skipAuth: true });
    descargarBlob(blob, nombreOriginal || `producto-${productoId}`);
};

/** Descarga un archivo específico del producto (docente autenticado). */
export const descargarArchivoProducto = async (productoId, archivoId, nombreOriginal) => {
    const blob = await fetchArchivoBlob(`/api/productos/mis/${productoId}/archivos/${archivoId}`);
    descargarBlob(blob, nombreOriginal || `archivo-${archivoId}`);
};

/** Descarga por id de archivo (ruta pública con restricciones de acceso). */
export const descargarArchivoPublico = async (productoId, archivoId, nombreOriginal) => {
    const blob = await fetchArchivoBlob(
        `/api/productos/${productoId}/archivos/${archivoId}`,
        { skipAuth: true },
    );
    descargarBlob(blob, nombreOriginal || `archivo-${archivoId}`);
};