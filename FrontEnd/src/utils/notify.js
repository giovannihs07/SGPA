import Swal from "sweetalert2";

/** Evita alertas duplicadas cuando el interceptor ya manejó la sesión expirada */
let suppressNotifications = false;

export const setSuppressNotifications = (value) => {
    suppressNotifications = value;
};

/** Configuración base compartida por todas las alertas.
    Ajuste de colores.
 */
const BASE = {
    // Getter: al hacer `...BASE` se evalúa en cada alerta y sigue el modo claro/oscuro de la app
    // (el tema "auto" de SweetAlert usa la preferencia del sistema, no la clase .dark).
    get theme() {
        return document.documentElement.classList.contains("dark") ? "dark" : "light";
    },
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
export const notifyError = (title, text) => {
    if (suppressNotifications) return Promise.resolve();
    return Swal.fire({
        ...BASE,
        icon:  "error",
        title,
        text,
        confirmButtonText: "Entendido",
    });
};

/**
 * Diálogo de confirmación. Devuelve true si el usuario confirmó.
 *
 * @param {string} title
 * @param {string} [text] — texto plano (omitir si usas `options.html`)
 * @param {{ html?: string, confirmButtonText?: string, icon?: import("sweetalert2").SweetAlertIcon }} [options]
 *        `icon` por defecto es "warning".
 *
 * @example
 * const ok = await notifyConfirm("¿Eliminar producto?", "Esta acción no se puede deshacer.");
 * if (ok) deleteProduct();
 */
export const notifyConfirm = (title, text, options = {}) =>
    Swal.fire({
        ...BASE,
        icon:              options.icon ?? "warning",
        title,
        ...(options.html ? { html: options.html } : { text: text ?? "" }),
        showCancelButton:  true,
        confirmButtonText: options.confirmButtonText ?? "Sí, continuar",
        cancelButtonText:  "Cancelar",
    }).then((result) => result.isConfirmed);
