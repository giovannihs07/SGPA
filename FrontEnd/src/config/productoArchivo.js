/** Límite de adjuntos — debe coincidir con application.properties (10MB). */
export const MAX_ARCHIVO_MB = 10;
export const MAX_ARCHIVO_BYTES = MAX_ARCHIVO_MB * 1024 * 1024;

/** Debe coincidir con FileStorageServiceImpl.extensionesPermitidas */
export const EXTENSIONES_PERMITIDAS = [
    "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
    "zip", "rar", "7z",
];

export const ACCEPT_ARCHIVO = EXTENSIONES_PERMITIDAS.map((ext) => `.${ext}`).join(",");

export const ETIQUETA_FORMATOS_ARCHIVO =
    `PDF, Word, Excel, PowerPoint, ZIP, RAR, 7Z — máx. ${MAX_ARCHIVO_MB} MB`;

export const mensajeArchivoExcedeLimite = (sizeBytes) => {
    const pesoMb = (sizeBytes / 1024 / 1024).toFixed(2);
    return `El archivo pesa ${pesoMb} MB. El tamaño máximo permitido es ${MAX_ARCHIVO_MB} MB.`;
};

export const obtenerExtensionArchivo = (nombre) => {
    if (!nombre || !nombre.includes(".")) return "";
    return nombre.slice(nombre.lastIndexOf(".") + 1).toLowerCase();
};

export const esExtensionPermitida = (nombre) => {
    const ext = obtenerExtensionArchivo(nombre);
    return ext !== "" && EXTENSIONES_PERMITIDAS.includes(ext);
};

export const mensajeExtensionNoPermitida = (nombre) => {
    const ext = obtenerExtensionArchivo(nombre) || "sin extensión";
    return `El tipo de archivo ".${ext}" no está permitido. Formatos aceptados: ${EXTENSIONES_PERMITIDAS.join(", ")}.`;
};
