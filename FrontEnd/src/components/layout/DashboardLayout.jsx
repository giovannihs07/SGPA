import { useContext } from "react";
import { Outlet } from "react-router-dom";
import  { AuthContext } from "../../context/AuthContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useSidebar } from "../../hooks/useSidebar";
import { surface } from "../../components/ui/themeTokens";

// El layout del dashboard con sidebar y header
export const DashboardLayout = () => {
    const { handlerLogout } = useContext(AuthContext);
    const { isCollapsed, toggleSidebar } = useSidebar();

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
                <Header />

                <main className="flex-1 p-6">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
};
