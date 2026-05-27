import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ onlyAdmin, onlySuperAdmin }) {
    const { login } = useAuth();

    if (!login.isAuth) return <Navigate to="/login" replace />;

    if (onlySuperAdmin && !login.isSuperAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (onlyAdmin && !login.isAdmin && !login.isSuperAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
