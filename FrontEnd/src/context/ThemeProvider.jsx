import { useState, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

const AUTH_PATHS = new Set(["/login", "/register"]);

export const ThemeProvider = ({ children }) => {
    const location = useLocation();
    const isAuthRoute = AUTH_PATHS.has(location.pathname);

    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved) return saved === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useLayoutEffect(() => {
        const root = document.documentElement;
        const applyDark = isDark && !isAuthRoute;

        if (applyDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        if (!isAuthRoute) {
            localStorage.setItem("theme", isDark ? "dark" : "light");
        }
    }, [isDark, isAuthRoute]);

    const toggleTheme = () => setIsDark(v => !v);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
