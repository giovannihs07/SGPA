import Swal from "sweetalert2";

/** Configuración base compartida por todas las alertas.
    Ajuste de colores.
 */
const BASE = {
    confirmButtonColor: "#EC7A21",
    cancelButtonColor:  "#6b7280",
    customClass: {
        popup:         "!rounded-xl !font-sans",
        confirmButton: "!rounded-lg !text-sm !font-semibold !px-5",
        cancelButton:  "!rounded-lg !text-sm !font-semibold !px-5",
        denyButton:    "!rounded-lg !text-sm !font-semibold !px-5",
    },
};

export const SWAL_BASE = BASE;

/** Alerta de operación exitosa (se cierra sola) */
export const notifySuccess = (title, text) =>
    Swal.fire({
        ...BASE,
        icon:  "success",
        title,
        text,
        timer:            3000,
        timerProgressBar: true,
        showConfirmButton: false,
    });

/** Alerta informativa */
export const notifyInfo = (title, text) =>
    Swal.fire({
        ...BASE,
        icon:              "info",
        title,
        text,
        confirmButtonText: "Entendido",
    });

/** Alerta de error */
export const notifyError = (title, text) =>
    Swal.fire({
        ...BASE,
        icon:  "error",
        title,
        text,
        confirmButtonText: "Entendido",
    });

/**
 * Diálogo de confirmación. Devuelve true si el usuario confirmó.
 *
 * @example
 * const ok = await notifyConfirm("¿Eliminar producto?", "Esta acción no se puede deshacer.");
 * if (ok) deleteProduct();
 */
export const notifyConfirm = (title, text) =>
    Swal.fire({
        ...BASE,
        icon:              "warning",
        title,
        text,
        showCancelButton:  true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText:  "Cancelar",
    }).then((result) => result.isConfirmed);
