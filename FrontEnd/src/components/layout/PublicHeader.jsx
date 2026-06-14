import { Link } from "react-router-dom";
import { Sun, Moon, LogIn } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export const PublicHeader = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="h-14 bg-[#FFB700] border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 shrink-0">
            <Link to="/portal/public" className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-[#A63C24] rounded-sm flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#ffc20e]" aria-hidden="true">
                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                    </svg>
                </div>
                <div className="min-w-0 hidden sm:block">
                    <p className="text-[#222222] text-sm font-bold leading-none truncate">SGPA</p>
                    <p className="text-[#222222]/60 text-[10px] mt-0.5 truncate">Unicartagena</p>
                </div>
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
