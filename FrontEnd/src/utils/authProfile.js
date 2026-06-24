/** Usuario con ROLE_DOCENTE y ROLE_ADMIN (sin super admin). */
export const isDocenteAdmin = (login) =>
    Boolean(login?.isDocente && login?.isAdmin && !login?.isSuperAdmin);

/** Perfil de navegación derivado del estado de login. */
export const getNavProfile = (login) => {
    if (login?.isSuperAdmin) return "SUPERADMIN";
    if (isDocenteAdmin(login)) return "DOCENTE_ADMIN";
    if (login?.isAdmin) return "ADMIN";
    if (login?.isDocente) return "DOCENTE";
    return "ESTUDIANTE";
};

/** Ruta del dashboard principal según roles. */
export const dashboardPath = (login) => {
    if (login?.isSuperAdmin) return "/dashboard/superadmin";
    if (isDocenteAdmin(login)) return "/dashboard/docente-admin";
    if (login?.isAdmin) return "/dashboard/admin";
    if (login?.isDocente) return "/dashboard/docente";
    return "/portal/public";
};

/** Etiqueta visible del rol en header y badges. */
export const getRolLabel = (login) => {
    if (login?.isSuperAdmin) return "Super Admin";
    if (isDocenteAdmin(login)) return "Docente administrativo";
    if (login?.isAdmin) return "Administrativo";
    if (login?.isDocente) return "Docente";
    return "Estudiante";
};

/** Nombre completo del usuario autenticado. */
export const getNombreCompleto = (login) =>
    [login?.user?.nombre, login?.user?.apellido].filter(Boolean).join(" ").trim();
