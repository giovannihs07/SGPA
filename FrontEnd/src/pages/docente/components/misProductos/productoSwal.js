import Swal from "sweetalert2";
import { SWAL_BASE, notifyInfo, notifyError } from "../../../../utils/notify";
import { etiquetaRolArchivo, ROL_PRINCIPAL } from "../../../../config/productoArchivo";
import {
    puedeEditarProducto, puedeEliminarProducto,
    MENSAJE_EDICION_BLOQUEADA, MENSAJE_ELIMINACION_BLOQUEADA,
    obtenerArchivosProducto,
} from "../productoHelpers";

/** Bloquea navegación a edición si el producto está publicado */
export const intentarEditarProducto = (producto, onEditar) => {
    if (!puedeEditarProducto(producto)) {
        return notifyInfo("Producto publicado", MENSAJE_EDICION_BLOQUEADA);
    }
    onEditar?.(producto);
};

/** Confirmación antes de despublicar un producto */
export const confirmDespublicarProducto = (producto) => Swal.fire({
    ...SWAL_BASE,
    icon: "warning",
    title: "¿Despublicar producto?",
    html: `<p class="text-sm text-gray-600 dark:text-gray-300">
        El producto <strong>"${producto.nombre}"</strong> dejará de ser visible en el catálogo público.
    </p>`,
    showCancelButton: true,
    confirmButtonText: "Sí, despublicar",
    cancelButtonText: "Cancelar",
}).then((r) => r.isConfirmed);

/**
 * Modal de publicación: el docente elige visibilidad por archivo.
 * @returns {Promise<Array<{archivoId, accesoPublico}>|null>}
 */
export const confirmPublicarProducto = async (producto) => {
    const archivos = obtenerArchivosProducto(producto).filter((a) => a.id);

    if (!archivos.length) {
        await notifyError(
            "Sin archivos",
            "El producto debe tener al menos un archivo adjunto para publicarse.",
        );
        return null;
    }

    const filas = archivos.map((a) => {
        const defectoPublico = a.rol === ROL_PRINCIPAL;
        return `
            <div class="flex items-center justify-between gap-3 py-2.5 border-b border-gray-100 dark:border-gray-600 last:border-0">
                <div class="text-left min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">${a.nombreOriginal}</p>
                    <p class="text-xs text-gray-500">${etiquetaRolArchivo(a.rol)}</p>
                </div>
                <select id="vis-archivo-${a.id}"
                    class="text-xs border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5
                        bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 shrink-0">
                    <option value="true" ${defectoPublico ? "selected" : ""}>Público</option>
                    <option value="false" ${!defectoPublico ? "selected" : ""}>Restringido</option>
                </select>
            </div>
        `;
    }).join("");

    const result = await Swal.fire({
        ...SWAL_BASE,
        icon: "question",
        title: "¿Publicar producto?",
        width: 520,
        html: `
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 text-left">
                <strong>"${producto.nombre}"</strong> será visible en el catálogo.
                Elige qué archivos serán <strong>públicos</strong> (descargables por cualquiera)
                y cuáles <strong>restringidos</strong> (solo tú podrás descargarlos).
            </p>
            <div class="text-left max-h-56 overflow-y-auto px-1">${filas}</div>
        `,
        showCancelButton: true,
        confirmButtonText: "Sí, publicar",
        cancelButtonText: "Cancelar",
        preConfirm: () => archivos.map((a) => ({
            archivoId: a.id,
            accesoPublico: document.getElementById(`vis-archivo-${a.id}`)?.value === "true",
        })),
    });

    return result.isConfirmed ? result.value : null;
};

/** Confirmación de eliminación con SweetAlert2 */
export const confirmEliminarProducto = (producto) => {
    const nArchivos = obtenerArchivosProducto(producto).length;
    const avisoArchivo = nArchivos > 0
        ? `<p class="text-xs text-amber-600 mt-2">También se eliminarán ${nArchivos === 1 ? "el archivo adjunto" : `los ${nArchivos} archivos adjuntos`}.</p>`
        : "";

    return Swal.fire({
        ...SWAL_BASE,
        icon: "warning",
        title: "¿Eliminar producto?",
        html: `<p class="text-sm text-gray-600">
            ¿Estás seguro de eliminar <strong>"${producto.nombre}"</strong>?
            Esta acción no se puede deshacer.
        </p>${avisoArchivo}`,
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        confirmButtonColor: "#dc2626",
        cancelButtonText: "Cancelar",
    }).then((r) => r.isConfirmed);
};

/** Bloquea eliminación si el producto está publicado */
export const intentarEliminarProducto = async (producto) => {
    if (!puedeEliminarProducto(producto)) {
        await notifyInfo("Producto publicado", MENSAJE_ELIMINACION_BLOQUEADA);
        return false;
    }
    return confirmEliminarProducto(producto);
};
