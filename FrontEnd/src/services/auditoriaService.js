import axiosInstance from "./axiosInstance";

/**
 * GET /api/auditoria
 */
export const getAuditLogs = async (params = {}) => {
    const { data } = await axiosInstance.get("/api/auditoria", { params });
    return data;
};

/**
 * GET /api/auditoria/resumen
 */
export const getAuditResumen = async () => {
    const { data } = await axiosInstance.get("/api/auditoria/resumen");
    return data;
};
