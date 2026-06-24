import { FileText, FileArchive, Image, File } from "lucide-react";
import { CATEGORIA_LABELS, parseFechaLocal } from "../../docente/components/productoHelpers";

export const CATEGORIA_BADGE = {
    INVESTIGATIVO: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    ACADEMICO: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    Investigativo: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    Académico: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

export const categoriaBadgeClass = (categoria) =>
    CATEGORIA_BADGE[categoria] ?? "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";

export const nombreDocente = (p) => {
    const partes = [p?.docenteNombre, p?.docenteApellido].filter(Boolean);
    return partes.length ? partes.join(" ") : (p?.docenteCodigo ?? "—");
};

export const inicialesDocente = (p) => {
    const nombre = nombreDocente(p);
    if (!nombre || nombre === "—") return "?";
    const partes = nombre.trim().split(/\s+/);
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
    return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
};

export const formatFechaRelativa = (fecha) => {
    const objetivo = parseFechaLocal(fecha);
    if (!objetivo) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const dias = Math.round((hoy.getTime() - objetivo.getTime()) / 86_400_000);

    if (dias <= 0) return "Hoy";
    if (dias === 1) return "Ayer";
    if (dias < 30) return `Hace ${dias} días`;
    if (dias < 365) {
        const meses = Math.floor(dias / 30);
        return meses === 1 ? "Hace 1 mes" : `Hace ${meses} meses`;
    }
    const años = Math.floor(dias / 365);
    return años === 1 ? "Hace 1 año" : `Hace ${años} años`;
};

export const etiquetaCategoria = (categoria) =>
    CATEGORIA_LABELS[categoria] ?? categoria ?? "—";

const ICONO_POR_EXT = {
    PDF: FileText,
    DOC: FileText,
    DOCX: FileText,
    ZIP: FileArchive,
    RAR: FileArchive,
    JPG: Image,
    JPEG: Image,
    PNG: Image,
    WEBP: Image,
};

export const iconoArchivo = (ext) => ICONO_POR_EXT[ext?.toUpperCase()] ?? File;
