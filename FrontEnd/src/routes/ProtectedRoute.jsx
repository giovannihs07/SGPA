import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ onlyAdmin }) {
    const { login } = useAuth();

    if (!login.isAuth) return <Navigate to="/login" replace />;

    if (onlyAdmin && !login.isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
