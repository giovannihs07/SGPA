import {
    LayoutDashboard,
    FilePlus,
    BookOpen,
    Search,
    BarChart2,
    Users,
    CheckSquare,
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
                { label: "Dashboard",          icon: LayoutDashboard, path: "/dashboard/docente" },
                { label: "Registrar producto", icon: FilePlus,         path: "/dashboard/docente/registrar" },
                { label: "Mis productos",      icon: BookOpen,         path: "/dashboard/docente/productos" },
            ],
        },
        {
            section: "Consultas",
            items: [
                { label: "Buscar",    icon: Search,    path: "/dashboard/docente/buscar" },
                { label: "Reportes", icon: BarChart2,  path: "/dashboard/docente/reportes" },
            ],
        },
    ],

    ADMIN: [
        {
            section: "Principal",
            items: [
                { label: "Dashboard",      icon: LayoutDashboard, path: "/dashboard/admin" },
                { label: "Usuarios",       icon: Users,           path: "/dashboard/admin/usuarios" },
                { label: "Todos los productos", icon: BookOpen,   path: "/dashboard/admin/productos" },
            ],
        },
        {
            section: "Gestión",
            items: [
                { label: "Aprobar / rechazar", icon: CheckSquare, path: "/dashboard/admin/aprobaciones" },
                { label: "Reportes",           icon: BarChart2,   path: "/dashboard/admin/reportes" },
            ],
        },
    ],

    SUPERADMIN: [
        {
            section: "Principal",
            items: [
                { label: "Dashboard",           icon: LayoutDashboard, path: "/dashboard/superadmin" },
                { label: "Usuarios",            icon: Users,           path: "/dashboard/superadmin/usuarios" },
                { label: "Todos los productos", icon: BookOpen,        path: "/dashboard/superadmin/productos" },
            ],
        },
        {
            section: "Gestión",
            items: [
                { label: "Aprobar / rechazar", icon: CheckSquare, path: "/dashboard/superadmin/aprobaciones" },
                { label: "Reportes",           icon: BarChart2,   path: "/dashboard/superadmin/reportes" },
                { label: "Logs de auditoría",  icon: ScrollText,  path: "/dashboard/superadmin/auditoria" },
                { label: "Configuración",      icon: Settings,    path: "/dashboard/superadmin/configuracion" },
            ],
        },
    ],

    ESTUDIANTE: [
        {
            section: "Principal",
            items: [
                { label: "Dashboard",    icon: LayoutDashboard, path: "/dashboard/estudiante" },
                { label: "Explorar",     icon: Library,         path: "/dashboard/estudiante/explorar" },
                { label: "Buscar",       icon: Search,          path: "/dashboard/estudiante/buscar" },
            ],
        },
    ],
};
