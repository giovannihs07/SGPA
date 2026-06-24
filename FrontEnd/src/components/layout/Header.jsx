import { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { getNombreCompleto, getRolLabel } from "../../utils/authProfile";
import { UserMenu } from "./UserMenu";

export const Header = () => {
    const { login } = useContext(AuthContext);

    const { isDark, toggleTheme } = useTheme();

    const rolLabel = getRolLabel(login);
    const nombreCompleto = getNombreCompleto(login);

    return (
        <header className="h-14 bg-[#FFB700] dark:bg-[#FFB700] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 shrink-0">

            {/* Logo UDC */}
            <div>
                <img
                    src="/logo-udc.png"
                    alt="Universidad de Cartagena"
                    className="h-15 object-contain"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-4">

                {/* Toggle dark/light */}
                <button
                    onClick={toggleTheme}
                    title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                        ${isDark ? "text-[#222222] hover:bg-black/15" : "text-gray-700 hover:bg-black/10"}`}
                >
                    {isDark
                        ? <Sun size={18} />
                        : <Moon size={18} />
                    }
                </button>

                {/* Badge de usuario */}
                <div
                    className="hidden sm:flex flex-col items-end leading-tight px-2.5 py-1 rounded-md text-[#222222] max-w-56"
                    title={nombreCompleto ? `${nombreCompleto} — ${rolLabel}` : rolLabel}
                >
                    {nombreCompleto ? (
                        <>
                            <span className="text-xs font-semibold truncate max-w-full">
                                {nombreCompleto}
                            </span>
                            <span className="text-[11px] font-medium opacity-80 truncate max-w-full">
                                {rolLabel}
                            </span>
                        </>
                    ) : (
                        <span className="text-xs font-medium">{rolLabel}</span>
                    )}
                </div>

                <UserMenu />
            </div>
        </header>
    );
};
