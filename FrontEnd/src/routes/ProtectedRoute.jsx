import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protege rutas que requieren autenticación.
 * Si se pasa `roles`, verifica que el usuario tenga uno de esos roles.
 *
 * Uso:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
 *     <Route path="/admin" element={<AdminPanel />} />
 *   </Route>
 */
export default function ProtectedRoute({ roles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null; // espera a que se restaure la sesión

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user?.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
