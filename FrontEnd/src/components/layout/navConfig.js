import {
    LayoutDashboard,
    FilePlus,
    BookOpen,
    Search,
    BarChart2,
    Users,
    Settings,
    Library,
    ScrollText,
} from "lucide-react";

// Navegación según rol
export const NAV_ITEMS = {
    DOCENTE: [
        {
            section: "Principal",
            items: [
                { label: "Dashboard",          icon: LayoutDashboard, path: "/dashboard/docente", end: true },
                { label: "Registrar producto", icon: FilePlus,         path: "/dashboard/docente/registrar" },
                { label: "Mis productos",      icon: BookOpen,         path: "/dashboard/docente/productos" },
            ],
        },
        {
            section: "Consultas",
            items: [
                { label: "Mis reportes", icon: BarChart2, path: "/dashboard/docente/reportes" },
            ],
        },
    ],

    DOCENTE_ADMIN: [
        {
            section: "Mi producción",
            items: [
                { label: "Dashboard",          icon: LayoutDashboard, path: "/dashboard/docente-admin", end: true },
                { label: "Registrar producto", icon: FilePlus,         path: "/dashboard/docente/registrar" },
                { label: "Mis productos",      icon: BookOpen,         path: "/dashboard/docente/productos" },
            ],
        },
        {
            section: "Gestión institucional",
            items: [
                { label: "Usuarios",            icon: Users,    path: "/dashboard/admin/usuarios" },
                { label: "Todos los productos", icon: BookOpen, path: "/dashboard/admin/productos" },
            ],
        },
        {
            section: "Reportes",
            items: [
                { label: "Mis reportes",             icon: BarChart2, path: "/dashboard/docente/reportes" },
                { label: "Reportes institucionales", icon: BarChart2, path: "/dashboard/admin/reportes" },
            ],
        },
    ],

    ADMIN: [
        {
            section: "Principal",
            items: [
                { label: "Dashboard",      icon: LayoutDashboard, path: "/dashboard/admin", end: true },
                { label: "Usuarios",       icon: Users,           path: "/dashboard/admin/usuarios" },
                { label: "Todos los productos", icon: BookOpen,   path: "/dashboard/admin/productos" },
            ],
        },
        {
            section: "Gestión",
            items: [
                { label: "Reportes", icon: BarChart2, path: "/dashboard/admin/reportes" },
            ],
        },
    ],

    SUPERADMIN: [
        {
            section: "Principal",
            items: [
                { label: "Dashboard",           icon: LayoutDashboard, path: "/dashboard/superadmin", end: true },
                { label: "Usuarios",            icon: Users,           path: "/dashboard/superadmin/usuarios" },
                { label: "Todos los productos", icon: BookOpen,        path: "/dashboard/superadmin/productos" },
            ],
        },
        {
            section: "Gestión",
            items: [
                { label: "Reportes",          icon: BarChart2,  path: "/dashboard/superadmin/reportes" },
                { label: "Logs de auditoría", icon: ScrollText, path: "/dashboard/superadmin/auditoria" },
                { label: "Configuración",     icon: Settings,   path: "/dashboard/superadmin/configuracion" },
            ],
        },
    ],

    ESTUDIANTE: [
        {
            section: "Principal",
            items: [
                { label: "Explorar producción", icon: Library, path: "/portal/public" },
            ],
        },
    ],
};
