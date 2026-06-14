import { Link } from "react-router-dom";
import { Sun, Moon, LogIn } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export const PublicHeader = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="h-14 bg-[#FFB700] dark:bg-[#FFB700] flex items-center justify-between px-6 shrink-0 overflow-hidden">
            <Link to="/portal/public" className="flex items-center min-w-0">
                <img
                    src="/logo-udc.png"
                    alt="Universidad de Cartagena"
                    className="h-15 object-contain"
                />
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={toggleTheme}
                    title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors
                        ${isDark ? "text-[#222222] hover:bg-black/15" : "text-gray-700 hover:bg-black/10"}`}
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold
                        bg-[#222222] text-[#C8963E] hover:bg-[#222222] transition shrink-0"
                >
                    <LogIn size={15} aria-hidden="true" />
                    <span className="hidden sm:inline">Iniciar sesión</span>
                    <span className="sm:hidden">Ingresar</span>
                </Link>
            </div>
        </header>
    );
};
