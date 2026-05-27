import { useAuth } from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { NAV_ITEMS } from "./navConfig";

export const Sidebar = ({ isCollapsed, onToggle, onLogout }) => {
    const { login } = useAuth();
    const rol = login?.isSuperAdmin ? "SUPERADMIN"
        : login?.isAdmin ? "ADMIN"
        : "DOCENTE";
    const sections = NAV_ITEMS[rol] || NAV_ITEMS["DOCENTE"];

    return (
        <aside
            className={`
                relative flex flex-col bg-[#222222] transition-all duration-300 ease-in-out
                ${isCollapsed ? "w-17" : "w-55"}
                min-h-screen shrink-0
            `}
        >
            {/* Logo */}
            <div className={`flex items-center gap-3 px-5 py-5 border-b border-white/10 ${isCollapsed ? "justify-center px-0" : ""}`}>
                <div className="w-10 h-10 bg-[#ffc20e] rounded-sm flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                    </svg>
                </div>
                {!isCollapsed && (
                    <div>
                        <p className="text-[#ffc20e] text-sm font-semibold leading-none">SGPA</p>
                        <p className="text-white/40 text-[10px] mt-0.5">Unicartagena</p>
                    </div>
                )}
            </div>

            {/* Navegación */}
            <nav className="flex-1 py-3 overflow-y-auto">
                {sections.map(({ section, items }) => (
                    <div key={section}>
                        {!isCollapsed && (
                            <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-5 pt-4 pb-1">
                                {section}
                            </p>
                        )}
                        {isCollapsed && <div className="my-2 mx-3 border-t border-white/10" />}

                        {items.map(({ label, icon: Icon, path }) => (
                            <NavLink
                                key={path}
                                to={path}
                                title={isCollapsed ? label : undefined}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-5 py-2.5 text-sm transition-colors duration-150
                                    ${isCollapsed ? "justify-center px-0 py-3" : ""}
                                    ${isActive
                                        ? "bg-[#ffc20e]/15 text-white border-l-2 border-[#ffc20e]"
                                        : "text-white/90 hover:text-white hover:bg-white/5"
                                    }
                                `}
                            >
                                <Icon size={18} className="shrink-0" />
                                {!isCollapsed && <span>{label}</span>}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* Botón colapsar */}
            <button
                onClick={onToggle}
                title={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                className={`
                    flex items-center gap-2 px-5 py-3 text-white/60 hover:text-white
                    hover:bg-white/5 transition-colors text-sm border-t border-white/10
                    ${isCollapsed ? "justify-center px-0" : ""}
                `}
            >
                {isCollapsed
                    ? <ChevronRight size={18} />
                    : <><ChevronLeft size={18} /><span>Ocultar</span></>
                }
            </button>

            {/* Cerrar sesión */}
            <button
                onClick={onLogout}
                className={`
                    flex items-center gap-2 px-5 py-4 text-white/60 hover:text-white
                    hover:bg-white/5 transition-colors text-sm border-t border-white/10
                    ${isCollapsed ? "justify-center px-0" : ""}
                `}
                title="Cerrar sesión"
            >
                <LogOut size={18} className="shrink-0" />
                {!isCollapsed && <span>Cerrar sesión</span>}
            </button>
        </aside>
    );
};
