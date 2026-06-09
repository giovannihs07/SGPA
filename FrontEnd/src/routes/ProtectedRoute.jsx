import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { isDocenteAdmin } from "../utils/authProfile";

export default function ProtectedRoute({ onlyAdmin, onlySuperAdmin, onlyDocente, onlyDocenteAdmin }) {
    const { login } = useContext(AuthContext);

    if (!login.isAuth) return <Navigate to="/login" replace />;

    if (onlySuperAdmin && !login.isSuperAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (onlyAdmin && !login.isAdmin && !login.isSuperAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (onlyDocente && !login.isDocente) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (onlyDocenteAdmin && !isDocenteAdmin(login)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}
