import axiosInstance from "./axiosInstance";

const limpiarParams = (params = {}) =>
    Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
    );

/** GET /api/reportes/produccion — reporte ejecutivo (agregados). */
export const getReporteProduccionEjecutivo = async (params = {}) => {
    const { data } = await axiosInstance.get("/api/reportes/produccion", {
        params: limpiarParams(params),
    });
    return data;
};

/** GET /api/reportes/produccion/productos — inventario completo filtrado. */
export const getReporteProduccionProductos = async (params = {}) => {
    const { data } = await axiosInstance.get("/api/reportes/produccion/productos", {
        params: limpiarParams(params),
    });
    return data;
};

/** GET /api/reportes/produccion/docentes — ranking completo filtrado. */
export const getReporteProduccionDocentes = async (params = {}) => {
    const { data } = await axiosInstance.get("/api/reportes/produccion/docentes", {
        params: limpiarParams(params),
    });
    return data;
};

/** @deprecated Usar getReporteProduccionEjecutivo */
export const getReporteProduccion = getReporteProduccionEjecutivo;
