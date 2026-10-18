import { TIPO_LABELS, SUBCATEGORIA_LABELS, CATEGORIA_LABELS, ATRIBUTO_LABELS } from "../productoConfig";

// Labels en español y utilidades visuales para la tabla y el modal
export { TIPO_LABELS, SUBCATEGORIA_LABELS, CATEGORIA_LABELS };

// Estado badge
export const ESTADO_CONFIG = {
    PUBLICADO: {
        label: "Publicado",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        dot: "bg-green-500",
    },
    SIN_PUBLICAR: {
        label: "Sin publicar",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        dot: "bg-amber-400",
    },
    EN_REVISION: {
        label: "En revisión",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        dot: "bg-blue-500",
    },
    RECHAZADO: {
        label: "Rechazado",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        dot: "bg-red-500",
    },
};

export const getEstadoConfig = (publicado) =>
    publicado ? ESTADO_CONFIG.PUBLICADO : ESTADO_CONFIG.SIN_PUBLICAR;

/** Convierte YYYY-MM-DD (API) a Date en medianoche local, sin desfase UTC. */
export const parseFechaLocal = (fecha) => {
    if (!fecha) return null;
    const [y, m, d] = String(fecha).slice(0, 10).split("-").map(Number);
    if (!y || !m || !d) return null;
    const dt = new Date(y, m - 1, d);
    return Number.isNaN(dt.getTime()) ? null : dt;
};

export const formatFecha = (fecha) => {
    const dt = parseFechaLocal(fecha);
    if (!dt) return "—";
    return dt.toLocaleDateString("es-CO", {
        day: "2-digit", month: "short", year: "numeric",
    });
};

// Recorta texto largo para la tabla
export const truncar = (str, max = 60) =>
    str && str.length > max ? str.slice(0, max) + "…" : (str ?? "—");

/** Etiqueta legible para un atributo (taxonomía -> legacy -> clave formateada). */
export const etiquetaAtributo = (clave, etiquetasTaxonomia = null) => {
    if (!clave) return "—";
    if (etiquetasTaxonomia?.[clave]) return etiquetasTaxonomia[clave];
    if (ATRIBUTO_LABELS[clave]) return ATRIBUTO_LABELS[clave];
    return clave
        // Formateo de camelCase, PascalCase, snake_case a palabras separadas
        .replace(/_/g, " ")
        // Formateo de camelCase y PascalCase a palabras separadas
        .replace(/([a-záéíóúñ0-9])([A-ZÁÉÍÓÚÑ])/g, "$1 $2")
        // Formateo de acrónimos seguidos de palabra a palabras separadas
        .replace(/([A-ZÁÉÍÓÚÑ]+)([A-ZÁÉÍÓÚÑ][a-záéíóúñ])/g, "$1 $2")
        .trim(); // Elimina espacios al inicio y final
};

export const getExtensionArchivo = (producto) => {
    if (producto?.extensionArchivo) return producto.extensionArchivo;
    const nombre = producto?.nombreArchivoOriginal ?? producto?.nombreOriginal;
    if (!nombre || !nombre.includes(".")) return null;
    return nombre.slice(nombre.lastIndexOf(".") + 1).toUpperCase();
};

/** Lista unificada de archivos (nueva entidad o legacy). */
export const obtenerArchivosProducto = (producto) => {
    if (producto?.archivos?.length) return producto.archivos;
    if (producto?.nombreArchivo) {
        return [{
            id: null,
            nombreOriginal: producto.nombreArchivoOriginal,
            rol: "PRINCIPAL",
            accesoPublico: true,
            descargable: true,
            extensionArchivo: getExtensionArchivo(producto),
        }];
    }
    return [];
};

export const productoTieneArchivos = (producto) =>
    obtenerArchivosProducto(producto).length > 0;

export const puedeDescargarArchivo = (archivo) => archivo?.descargable !== false;

export const etiquetaAccesoArchivo = (archivo) =>
    archivo?.accesoPublico ? "Público" : "Restringido";

/** Vista admin: archivos restringidos visibles pero sin descarga. */
export const esVistaAdminArchivos = (archivos = []) =>
    archivos.some((a) => !a.accesoPublico && a.descargable === false);

export const esReciente = (fecha, dias = 30) => {
    const dt = parseFechaLocal(fecha);
    if (!dt) return false;
    const limite = new Date();
    limite.setHours(0, 0, 0, 0);
    limite.setDate(limite.getDate() - dias);
    return dt >= limite;
};

/** Solo productos sin publicar pueden editarse */
export const puedeEditarProducto = (producto) => !producto?.publicado;

/** Solo productos sin publicar pueden eliminarse */
export const puedeEliminarProducto = (producto) => !producto?.publicado;

/** Campos de fecha del sistema (columnas en productos_docentes). */
export const CAMPO_FECHA_REGISTRO_SGPA = "fechaRegistroSgpa";
export const CAMPO_FECHA_PUBLICACION_SGPA = "fechaPublicacionSgpa";

/** Compara YYYY-MM-DD contra rango [fechaDesde, fechaHasta] inclusive */
export const matchRangoFecha = (producto, {
    fechaDesde, fechaHasta, campo = CAMPO_FECHA_REGISTRO_SGPA,
}) => {
    if (!fechaDesde && !fechaHasta) return true;

    const raw = producto?.[campo];
    if (!raw) return false;

    const fecha = String(raw).slice(0, 10);
    if (fechaDesde && fecha < fechaDesde) return false;
    if (fechaHasta && fecha > fechaHasta) return false;
    return true;
};

export const MENSAJE_PRODUCTO_PUBLICADO =
    "Este producto está publicado. Despublícalo desde Mis productos para editarlo o eliminarlo.";

export const MENSAJE_EDICION_BLOQUEADA =
    "Este producto está publicado. Despublícalo desde Mis productos para poder editarlo.";

export const MENSAJE_ELIMINACION_BLOQUEADA =
    "Este producto está publicado. Despublícalo desde Mis productos para poder eliminarlo.";