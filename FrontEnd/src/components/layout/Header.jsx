import { useAuth } from "../../hooks/useAuth";
import { Sun, Moon, Bell } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";

// Función para generar las iniciales del email o del nombre de usuario para el avatar
const getInitials = (user) => {
    if (!user?.email) return "U";
    const name = user.email.split("@")[0];
    const parts = name.split(".");
    return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
};

const getRolLabel = (login) => {
    if (login?.isSuperAdmin) return "Super Admin";
    if (login?.isAdmin)      return "Administrativo";
    if (login?.isDocente)    return "Docente";
    return "Estudiante";
};

export const Header = ({ pageTitle = "Dashboard" }) => {
    const { login } = useAuth();
    console.log("login state:", login); 

    const { isDark, toggleTheme } = useTheme();

    const initials = getInitials(login?.user);
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
            {/* Título de la página */}
            <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                {pageTitle}
            </h1>
            

            {/* Acciones */}
            <div className="flex items-center gap-4">

                {/* Toggle dark/light */}
                <button
                    onClick={toggleTheme}
                    title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {isDark
                        ? <Sun size={18} />
                        : <Moon size={18} />
                    }
                </button>

                {/* Notificaciones */}
                <button
                    title="Notificaciones"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <Bell size={18} />
                </button>

                {/* Badge de rol */}
                <span className="hidden sm:inline-flex text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {rolLabel}
                </span>

                {/* Avatar con iniciales */}
                <div
                    title={login?.user?.email}
                    className="w-8 h-8 rounded-full bg-[#2B2B2B] flex items-center justify-center text-[#C8963E] text-xs font-semibold shrink-0 cursor-default"
                >
                    {initials}
                </div>
            </div>
        </header>
    );
};
