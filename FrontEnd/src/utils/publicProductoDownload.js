import { descargarArchivo, descargarArchivoPublico } from "../services/productoServices";
import { obtenerArchivosProducto } from "../pages/docente/components/productoHelpers";
import { notifyError } from "./notify";

export const descargarProductoPublico = async (producto, archivo = null) => {
    const lista = obtenerArchivosProducto(producto).filter((a) => a.accesoPublico !== false);
    const target = archivo ?? lista.find((a) => a.accesoPublico) ?? lista[0];
    if (!target) {
        notifyError("Sin archivo", "Este producto no tiene archivos públicos descargables.");
        return;
    }
    if (target.descargable === false) {
        notifyError("Acceso restringido", "Este archivo no está disponible para descarga pública.");
        return;
    }
    try {
        if (target.id) {
            await descargarArchivoPublico(producto.id, target.id, target.nombreOriginal);
        } else {
            await descargarArchivo(producto.id, target.nombreOriginal);
        }
    } catch (e) {
        notifyError("Error", e.message ?? "No se pudo descargar el archivo");
    }
};
