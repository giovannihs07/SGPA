import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
    return ctx;
};
