export const ROLE_LABELS = {
    ROLE_DOCENTE:      "Docente",
    ROLE_ADMIN:        "Administrativo",
    ROLE_SUPER_ADMIN:  "Super Admin",
};

// Configuración de los estados de los usuarios
export const ESTADO_USUARIO_CONFIG = {
    PENDIENTE: {
        label: "Pendiente",
        className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    ACTIVO: {
        label: "Activo",
        className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    INACTIVO: {
        label: "Inactivo",
        className: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    },
    RECHAZADO: {
        label: "Rechazado",
        className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
};

// Función para obtener el estado del usuario
export const getEstadoUsuarioConfig = (estado) =>
    ESTADO_USUARIO_CONFIG[estado] ?? {
        label: estado ?? "—",
        className: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    };

// Función para obtener el nombre completo del usuario
export const nombreCompleto = (u) =>
    [u?.nombre, u?.apellido].filter(Boolean).join(" ") || "—";

/** Normaliza los roles (array o Set serializado) a array de strings */
export const normalizarRoles = (roles) => {
    if (!roles) return [];
    return Array.isArray(roles) ? roles : [...roles];
};

// Configuración de los niveles de formación
export const NIVEL_LABELS = {
    TECNICA_PROFESIONAL: "Técnica profesional",
    TECNOLOGICA:         "Tecnológica",
    PREGRADO:            "Pregrado",
    ESPECIALIZACION:     "Especialización",
    MAESTRIA:            "Maestría",
    DOCTORADO:           "Doctorado",
    POSTDOCTORADO:       "Postdoctorado",
    EDUCACION_CONTINUA:  "Educación continua",
};
