/** Convierte la respuesta del API al estado del formulario */
export const productoToForm = (producto) => ({
    nombre:       producto.nombre ?? "",
    descripcion:  producto.descripcion ?? "",
    categoria:    producto.categoria ?? "",
    subcategoria: producto.subcategoria ?? "",
    tipo:         producto.tipo ?? "",
    atributos:    producto.atributos ?? {},
});

/** Payload JSON que espera el backend (nombre, descripcion, tipo, atributos) */
export const buildProductoPayload = (form, tipo) => ({
    nombre:      form.nombre.trim(),
    descripcion: form.descripcion.trim(),
    tipo,
    atributos:   form.atributos,
});

export const INITIAL_PRODUCTO_FORM = {
    nombre:       "",
    descripcion:  "",
    categoria:    "",
    subcategoria: "",
    tipo:         "",
    atributos:    {},
};

export const INPUT_BASE =
    "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 " +
    "placeholder-gray-300 dark:placeholder-gray-600 " +
    "focus:outline-none focus:ring-2 focus:ring-[#EFB357]/50 focus:border-[#EFB357] " +
    "transition disabled:opacity-40 disabled:cursor-not-allowed";
