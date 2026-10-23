export const MODULO_LABELS = {
    AUTH:          "Autenticación",
    USUARIOS:      "Usuarios",
    PRODUCTOS:     "Productos",
    CONFIGURACION: "Configuración",
    SISTEMA:       "Sistema",
};

export const ACCION_LABELS = {
    LOGIN:                "Inicio de sesión",
    LOGIN_FALLIDO:        "Login fallido",
    APROBAR_USUARIO:      "Aprobó usuario",
    RECHAZAR_USUARIO:     "Rechazó usuario",
    ACTIVAR_USUARIO:      "Activó usuario",
    DESACTIVAR_USUARIO:   "Desactivó usuario",
    CAMBIAR_ROLES:        "Cambió roles",
    CREAR_PRODUCTO:       "Creó producto",
    EDITAR_PRODUCTO:      "Editó producto",
    PUBLICAR_PRODUCTO:    "Publicó producto",
    DESPUBLICAR_PRODUCTO: "Despublicó producto",
    ELIMINAR_PRODUCTO:    "Eliminó producto",
    CREAR_INSTITUCION:    "Creó institución",
    EDITAR_INSTITUCION:   "Editó institución",
    ELIMINAR_INSTITUCION: "Eliminó institución",
    CREAR_FACULTAD:       "Creó facultad",
    EDITAR_FACULTAD:      "Editó facultad",
    ELIMINAR_FACULTAD:    "Eliminó facultad",
    CREAR_PROGRAMA:       "Creó programa",
    EDITAR_PROGRAMA:      "Editó programa",
    ELIMINAR_PROGRAMA:    "Eliminó programa",
    CREAR_CATEGORIA:          "Creó categoría",
    EDITAR_CATEGORIA:         "Editó categoría",
    ACTIVAR_CATEGORIA:        "Activó categoría",
    DESACTIVAR_CATEGORIA:     "Desactivó categoría",
    ELIMINAR_CATEGORIA:       "Eliminó categoría",
    CREAR_SUBCATEGORIA:       "Creó subcategoría",
    EDITAR_SUBCATEGORIA:      "Editó subcategoría",
    ACTIVAR_SUBCATEGORIA:     "Activó subcategoría",
    DESACTIVAR_SUBCATEGORIA:  "Desactivó subcategoría",
    ELIMINAR_SUBCATEGORIA:    "Eliminó subcategoría",
    CREAR_TIPO_PRODUCTO:      "Creó tipo de producto",
    EDITAR_TIPO_PRODUCTO:     "Editó tipo de producto",
    ACTIVAR_TIPO_PRODUCTO:    "Activó tipo de producto",
    DESACTIVAR_TIPO_PRODUCTO: "Desactivó tipo de producto",
    ELIMINAR_TIPO_PRODUCTO:   "Eliminó tipo de producto",
    CARGAR_TAXONOMIA_PREDETERMINADA: "Cargó taxonomía predeterminada",
};

export const RESULTADO_LABELS = {
    EXITOSO: "Exitoso",
    FALLIDO: "Fallido",
    CRITICO: "Crítico",
};

export const MODULOS_FILTRO = [
    { value: "TODOS", label: "Todos los módulos" },
    { value: "AUTH", label: "Autenticación" },
    { value: "USUARIOS", label: "Usuarios" },
    { value: "PRODUCTOS", label: "Productos" },
    { value: "CONFIGURACION", label: "Configuración" },
    { value: "SISTEMA", label: "Sistema" },
];

export const RESULTADOS_FILTRO = [
    { value: "TODOS", label: "Todos los resultados" },
    { value: "EXITOSO", label: "Exitoso" },
    { value: "FALLIDO", label: "Fallido" },
    { value: "CRITICO", label: "Crítico" },
];

export const labelModulo = (modulo) => MODULO_LABELS[modulo] ?? modulo ?? "—";
export const labelAccion = (accion) => ACCION_LABELS[accion] ?? accion ?? "—";
export const labelResultado = (resultado) => RESULTADO_LABELS[resultado] ?? resultado ?? "—";

export const formatFechaHora = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("es-CO", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
};

export const parseDetalles = (detalles) => {
    if (!detalles) return null;
    try {
        return JSON.parse(detalles);
    } catch {
        return detalles;
    }
};
