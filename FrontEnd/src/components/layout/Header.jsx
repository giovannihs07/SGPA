import { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { getRolLabel } from "../../utils/authProfile";
import { UserMenu } from "./UserMenu";

export const Header = () => {
    const { login } = useContext(AuthContext);

    const { isDark, toggleTheme } = useTheme();

    const rolLabel = getRolLabel(login);

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

                {/* Badge de rol */}
                <span className="hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-md bg-black/15 text-[#222222]">
                    {rolLabel}
                </span>

                <UserMenu />
            </div>
        </header>
    );
};
