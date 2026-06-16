/** Límite por archivo — debe coincidir con application.properties (10MB). */
export const MAX_ARCHIVO_MB = 10;
export const MAX_ARCHIVO_BYTES = MAX_ARCHIVO_MB * 1024 * 1024;
export const MAX_ARCHIVOS = 5;

export const ROL_PRINCIPAL = "PRINCIPAL";

export const ROLES_ARCHIVO = [
    { value: "PRINCIPAL",  label: "Principal" },
    { value: "ANEXO",      label: "Anexo" },
    { value: "EVIDENCIA",  label: "Evidencia" },
    { value: "OTRO",       label: "Otro" },
];

export const ETIQUETA_FORMATOS_ARCHIVO =
    `PDF, Word, Excel, PowerPoint, ZIP, RAR, 7Z — máx. ${MAX_ARCHIVO_MB} MB c/u`;

/** Debe coincidir con FileStorageServiceImpl.extensionesPermitidas */
export const EXTENSIONES_PERMITIDAS = [
    "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
    "zip", "rar", "7z",
];

export const ACCEPT_ARCHIVO = EXTENSIONES_PERMITIDAS.map((ext) => `.${ext}`).join(",");

export const mensajeArchivoExcedeLimite = (sizeBytes) => {
    const pesoMb = (sizeBytes / 1024 / 1024).toFixed(2);
    return `El archivo pesa ${pesoMb} MB. El máximo permitido por archivo es ${MAX_ARCHIVO_MB} MB.`;
};

export const obtenerExtensionArchivo = (nombre) => {
    if (!nombre || !nombre.includes(".")) return "";
    return nombre.slice(nombre.lastIndexOf(".") + 1).toLowerCase();
};

export const esExtensionPermitida = (nombre) => {
    const ext = obtenerExtensionArchivo(nombre);
    return ext !== "" && EXTENSIONES_PERMITIDAS.includes(ext);
};

export const esArchivoPdf = (archivo) => {
    const ext = (archivo?.extensionArchivo ?? obtenerExtensionArchivo(archivo?.nombreOriginal)).toLowerCase();
    return ext === "pdf";
};

export const mensajeExtensionNoPermitida = (nombre) => {
    const ext = obtenerExtensionArchivo(nombre) || "sin extensión";
    return `El tipo de archivo ".${ext}" no está permitido.`;
};

export const etiquetaRolArchivo = (rol) =>
    ROLES_ARCHIVO.find((r) => r.value === rol)?.label ?? rol;

export const crearEntradaArchivoNuevo = (file, rol, orden) => ({
    localId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    file,
    rol,
    orden,
});

export const tieneArchivoPrincipal = (guardados = [], nuevos = [], eliminarIds = []) => {
    const guardadosActivos = guardados.filter((a) => !eliminarIds.includes(a.id));
    const principalGuardado = guardadosActivos.some((a) => a.rol === ROL_PRINCIPAL);
    const principalNuevo = nuevos.some((a) => a.rol === ROL_PRINCIPAL);
    return principalGuardado || principalNuevo;
};

export const totalArchivosActivos = (guardados = [], nuevos = [], eliminarIds = []) =>
    guardados.filter((a) => !eliminarIds.includes(a.id)).length + nuevos.length;
