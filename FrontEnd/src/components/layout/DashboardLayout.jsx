import { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import  { AuthContext } from "../../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSidebar } from "../../hooks/useSidebar";

// Mapeo de rutas a títulos para el Header
const PAGE_TITLES = {
    "/dashboard/docente":              "Dashboard",
    "/dashboard/docente/registrar":    "Registrar producto",
    "/dashboard/docente/productos":    "Mis productos",
    "/dashboard/docente/buscar":       "Buscar",
    "/dashboard/docente/reportes":     "Reportes",
    "/dashboard/admin":                "Dashboard",
    "/dashboard/admin/usuarios":       "Usuarios",
    "/dashboard/admin/productos":      "Todos los productos",
    "/dashboard/admin/aprobaciones":   "Aprobar / rechazar",
    "/dashboard/admin/reportes":       "Reportes",
    "/dashboard/admin/configuracion":  "Configuración",
    "/dashboard/estudiante":           "Dashboard",
    "/dashboard/estudiante/explorar":  "Explorar productos",
    "/dashboard/estudiante/buscar":    "Buscar",
};

// El layout del dashboard con sidebar y header
export const DashboardLayout = () => {
    const { handlerLogout } = useContext(AuthContext);
    const { isCollapsed, toggleSidebar } = useSidebar();
    const location = useLocation();

    const pageTitle = PAGE_TITLES[location.pathname] || "Dashboard";

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar
                isCollapsed={isCollapsed}
                onToggle={toggleSidebar}
                onLogout={handlerLogout}
            />

            <div className="flex flex-col flex-1 min-w-0">
                <Header pageTitle={pageTitle} />

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
