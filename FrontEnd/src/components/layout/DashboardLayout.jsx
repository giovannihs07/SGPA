import { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import  { AuthContext } from "../../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useSidebar } from "../../hooks/useSidebar";
import { surface } from "../../components/ui/themeTokens";

// Mapeo de rutas a títulos para el Header
const PAGE_TITLES = {
    "/dashboard/docente":              "Dashboard",
    "/dashboard/docente-admin":        "Dashboard",
    "/dashboard/docente/registrar":    "Registrar producto",
    "/dashboard/docente/productos":    "Mis productos",
    "/dashboard/docente/reportes":     "Mis reportes",

    "/dashboard/admin":                "Dashboard",
    "/dashboard/admin/usuarios":       "Usuarios",
    "/dashboard/admin/productos":      "Todos los productos",
    "/dashboard/admin/reportes":       "Reportes institucionales",

    "/dashboard/superadmin":                "Dashboard",
    "/dashboard/superadmin/usuarios":       "Usuarios",
    "/dashboard/superadmin/productos":    "Todos los productos",
    "/dashboard/superadmin/reportes":       "Reportes",
    "/dashboard/superadmin/auditoria":      "Logs de auditoría",
    "/dashboard/superadmin/configuracion":  "Configuración",

    "/dashboard/estudiante":           "Dashboard",
    "/dashboard/estudiante/explorar":  "Explorar productos",
    "/dashboard/estudiante/buscar":    "Buscar",
};

// El layout del dashboard con sidebar y header
export const DashboardLayout = () => {
    const { handlerLogout } = useContext(AuthContext);
    const { isCollapsed, toggleSidebar } = useSidebar();
    const location = useLocation();

    const pageTitle = PAGE_TITLES[location.pathname]
        ?? (location.pathname.match(/\/productos\/\d+\/editar$/)
            ? "Editar producto"
            : "Dashboard");

    return (
        <div className={`min-h-screen ${surface.page}`}>
            <Sidebar
                isCollapsed={isCollapsed}
                onToggle={toggleSidebar}
                onLogout={handlerLogout}
            />

            <div
                className={`flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out
                    ${isCollapsed ? "ml-17" : "ml-55"}`}
            >
                <Header pageTitle={pageTitle} />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};
