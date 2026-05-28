import Swal from "sweetalert2";
import { SWAL_BASE, notifyInfo } from "../../../../utils/notify";
import {
    puedeEditarProducto, puedeEliminarProducto,
    MENSAJE_EDICION_BLOQUEADA, MENSAJE_ELIMINACION_BLOQUEADA,
} from "../productoHelpers";

/** Bloquea navegación a edición si el producto está publicado */
export const intentarEditarProducto = (producto, onEditar) => {
    if (!puedeEditarProducto(producto)) {
        return notifyInfo("Producto publicado", MENSAJE_EDICION_BLOQUEADA);
    }
    onEditar?.(producto);
};

/** Confirmación antes de publicar o despublicar un producto */
export const confirmTogglePublicacion = (producto) => {
    const publicando = !producto.publicado;

    return Swal.fire({
        ...SWAL_BASE,
        icon: "warning",
        title: publicando ? "¿Publicar producto?" : "¿Despublicar producto?",
        html: `<p class="text-sm text-gray-600 dark:text-gray-300">
            ${publicando
                ? `El producto <strong>"${producto.nombre}"</strong> será visible para todos los usuarios de la plataforma.`
                : `El producto <strong>"${producto.nombre}"</strong> dejará de ser visible para todos los usuarios.`
            }
        </p>`,
        showCancelButton: true,
        confirmButtonText: publicando ? "Sí, publicar" : "Sí, despublicar",
        cancelButtonText: "Cancelar",
    }).then((r) => r.isConfirmed);
};

/** Confirmación de eliminación con SweetAlert2 */
export const confirmEliminarProducto = (producto) => {
    const avisoArchivo = producto.nombreArchivo
        ? `<p class="text-xs text-amber-600 mt-2">También se eliminará el archivo adjunto.</p>`
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
