const SESSION_CODES = new Set(["SESSION_EXPIRED", "INVALID_TOKEN"]);

const isJwtTechnicalMessage = (text) =>
    typeof text === "string"
    && /jwt|expired|milliseconds|clock skew|allowed clock/i.test(text);

export const isSessionExpiredError = (error) => {
    const data = error?.response?.data;
    if (SESSION_CODES.has(data?.error)) return true;
    if (isJwtTechnicalMessage(data?.error)) return true;
    if (isJwtTechnicalMessage(data?.message)) return true;
    return false;
};

export const getApiErrorMessage = (error, fallback = "Ocurrió un error inesperado") => {
    const data = error?.response?.data;
    if (!data) return error?.message ?? fallback;

    if (data.message && !isJwtTechnicalMessage(data.message)) {
        return data.message;
    }

    if (data.error === "SESSION_EXPIRED") {
        return "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
    }
    if (data.error === "INVALID_TOKEN") {
        return "Tu sesión no es válida. Por favor, inicia sesión nuevamente.";
    }
    if (isJwtTechnicalMessage(data.error)) {
        return "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
    }

    return data.error ?? fallback;
};

const parseJsonBlob = async (blob) => {
    try {
        const text = await blob.text();
        return JSON.parse(text);
    } catch {
        return null;
    }
};

/** Extrae mensaje de error cuando la respuesta axios es un Blob (descargas) */
export const getApiErrorMessageAsync = async (error, fallback = "Ocurrió un error inesperado") => {
    const data = error?.response?.data;
    if (data instanceof Blob) {
        const json = await parseJsonBlob(data);
        if (json?.error) return json.error;
        if (json?.message) return json.message;
        return fallback;
    }
    return getApiErrorMessage(error, fallback);
};
