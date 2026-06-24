import {
    fetchArchivoInlineDocente,
    urlArchivoPublicoInline,
} from "../services/productoServices";
import { esArchivoPdf } from "../config/productoArchivo";
import { obtenerArchivosProducto, puedeDescargarArchivo } from "../pages/docente/components/productoHelpers";
import { notifyError } from "./notify";

export const verArchivoPublico = (producto, archivo) => {
    const target = archivo
        ?? obtenerArchivosProducto(producto).find((a) => a.accesoPublico !== false);
    if (!target) {
        notifyError("Sin archivo", "Este producto no tiene archivos públicos.");
        return;
    }
    if (!esArchivoPdf(target)) {
        notifyError("Vista no disponible", "Solo los archivos PDF pueden abrirse en el visor.");
        return;
    }
    if (target.descargable === false) {
        notifyError("Acceso restringido", "Este archivo no está disponible para consulta pública.");
        return;
    }

    const url = urlArchivoPublicoInline(producto.id, target.id);
    const ventana = window.open(url, "_blank", "noopener,noreferrer");
    if (!ventana) {
        notifyError(
            "Ventana bloqueada",
            "Permite ventanas emergentes en el navegador para ver el PDF.",
        );
    }
};

export const verArchivoDocente = async (producto, archivo, abrirPdf) => {
    const target = archivo
        ?? obtenerArchivosProducto(producto).find((a) => a.rol === "PRINCIPAL")
        ?? obtenerArchivosProducto(producto)[0];
    if (!target) {
        notifyError("Sin archivo", "Este producto no tiene archivos adjuntos.");
        return;
    }
    if (!esArchivoPdf(target)) {
        notifyError("Vista no disponible", "Solo los archivos PDF pueden abrirse en el visor.");
        return;
    }
    if (!puedeDescargarArchivo(target)) {
        notifyError("Acceso restringido", "No tienes permiso para ver este archivo.");
        return;
    }
    if (!target.id) {
        notifyError("Error", "No se pudo identificar el archivo.");
        return;
    }
    try {
        const blob = await fetchArchivoInlineDocente(producto.id, target.id);
        abrirPdf(blob, target.nombreOriginal);
    } catch (e) {
        notifyError("Error", e.message ?? "No se pudo abrir el archivo");
    }
};
