import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const getInitials = (user) => {
    if (!user?.email) return "U";
    const name = user.email.split("@")[0];
    const parts = name.split(".");
    return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
};

export const UserMenu = () => {
    const { login, handlerLogout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const initials = getInitials(login?.user);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                title={login?.user?.email}
                aria-expanded={open}
                aria-haspopup="menu"
                className="w-8 h-8 rounded-full bg-[#2B2B2B] flex items-center justify-center
                    text-[#C8963E] text-xs font-semibold shrink-0 hover:ring-2 hover:ring-[#EC7A21]/40 transition"
            >
                {initials}
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-600
                        bg-white dark:bg-gray-800 shadow-lg py-1 z-50"
                >
                    <p className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 truncate border-b
                        border-gray-100 dark:border-gray-700">
                        {login?.user?.email}
                    </p>
                    <Link
                        to="/dashboard/perfil"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200
                            hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <User size={16} />
                        Mi perfil
                    </Link>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                            setOpen(false);
                            handlerLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200
                            hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <LogOut size={16} />
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
};
