import { normalizarRoles, ROLES_ASIGNABLES_USUARIO } from "../superAdmin/superAdminHelpers";

export const ROLES_ASIGNABLES_ADMIN = ROLES_ASIGNABLES_USUARIO;

export const esUsuarioSuperAdmin = (usuario) =>
    normalizarRoles(usuario?.roles).includes("ROLE_SUPER_ADMIN");
