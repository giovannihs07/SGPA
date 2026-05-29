import { normalizarRoles } from "../superAdmin/superAdminHelpers";

export const ROLES_ASIGNABLES_ADMIN = (roles) =>
    (roles ?? []).filter((r) => r !== "ROLE_SUPER_ADMIN");

export const esUsuarioSuperAdmin = (usuario) =>
    normalizarRoles(usuario?.roles).includes("ROLE_SUPER_ADMIN");
