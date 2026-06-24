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

/** Roles asignables desde paneles de usuarios (docente y/o administrativo). */
export const ROLES_ASIGNABLES_USUARIO = (roles) =>
    (roles ?? []).filter((r) => r === "ROLE_DOCENTE" || r === "ROLE_ADMIN");

export const PERFILES_USUARIO_FILTRO = [
    { value: "TODOS",                 label: "Todos los perfiles" },
    { value: "DOCENTE",               label: "Docente" },
    { value: "ADMINISTRATIVO",        label: "Administrativo" },
    { value: "DOCENTE_ADMINISTRATIVO", label: "Docente administrativo" },
];

/** Filtra por perfil compuesto (docente, administrativo o ambos) */
export const matchFiltroPerfilUsuario = (usuario, filtroPerfil) => {
    if (!filtroPerfil || filtroPerfil === "TODOS") return true;

    const roles = normalizarRoles(usuario?.roles);
    const esDocente = roles.includes("ROLE_DOCENTE");
    const esAdmin = roles.includes("ROLE_ADMIN");

    switch (filtroPerfil) {
        case "DOCENTE":
            return esDocente && !esAdmin;
        case "ADMINISTRATIVO":
            return esAdmin && !esDocente;
        case "DOCENTE_ADMINISTRATIVO":
            return esDocente && esAdmin;
        default:
            return true;
    }
};

export const perfilRequiereFiltroDocente = (filtroPerfil) =>
    filtroPerfil === "DOCENTE" || filtroPerfil === "DOCENTE_ADMINISTRATIVO";

export const perfilRequiereFiltroAdministrativo = (filtroPerfil) =>
    filtroPerfil === "ADMINISTRATIVO";

export const construirMapaDocentesPorPersona = (docentes) => {
    const map = new Map();
    for (const d of docentes ?? []) {
        const programas = [...(d.programas ?? [])];
        map.set(d.id, {
            facultadIds: new Set(programas.map((p) => p.facultadId).filter(Boolean)),
            programaIds: new Set(programas.map((p) => p.id).filter(Boolean)),
        });
    }
    return map;
};

export const construirMapaAdministrativosPorPersona = (administrativos) => {
    const map = new Map();
    for (const a of administrativos ?? []) {
        map.set(a.id, { dependencia: a.dependencia ?? null });
    }
    return map;
};

export const enriquecerUsuariosConPerfil = (usuarios, mapaDocentes, mapaAdmin) =>
    (usuarios ?? []).map((u) => {
        const personaId = u.personaId ?? u.id;
        const doc = mapaDocentes.get(personaId);
        const adm = mapaAdmin.get(personaId);
        return {
            ...u,
            facultadIds: doc ? [...doc.facultadIds] : [],
            programaIds: doc ? [...doc.programaIds] : [],
            dependencia: adm?.dependencia ?? null,
        };
    });

const matchIdEnLista = (valor, ids) => {
    if (valor === "TODAS" || valor === "TODOS") return true;
    return (ids ?? []).some((id) => String(id) === String(valor));
};

export const matchFiltroFacultadUsuario = (usuario, filtroFacultad) =>
    matchIdEnLista(filtroFacultad, usuario?.facultadIds);

export const matchFiltroProgramaUsuario = (usuario, filtroPrograma) =>
    matchIdEnLista(filtroPrograma, usuario?.programaIds);

export const matchFiltroDependenciaUsuario = (usuario, filtroDependencia) => {
    if (filtroDependencia === "TODAS") return true;
    return (usuario?.dependencia ?? "") === filtroDependencia;
};

/** Búsqueda por nombre completo o cédula */
export const matchBusquedaUsuario = (usuario, busqueda) => {
    const q = busqueda.trim();
    if (!q) return true;

    const qLower = q.toLowerCase();
    const nombreCompletoUsuario = [usuario?.nombre, usuario?.apellido]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return nombreCompletoUsuario.includes(qLower)
        || usuario?.nombre?.toLowerCase().includes(qLower)
        || usuario?.apellido?.toLowerCase().includes(qLower)
        || (usuario?.cedula ?? "").includes(q);
};

export const listarDependenciasUnicas = (administrativos) =>
    [...new Set((administrativos ?? []).map((a) => a.dependencia).filter(Boolean))].sort();

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
