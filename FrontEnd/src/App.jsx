import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Páginas de autenticación
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Placeholder pages (reemplazar con tus dashboards reales)
const DashboardDocente = () => <div className="p-8 text-xl font-semibold">Dashboard Docente </div>;
const DashboardAdmin = () => <div className="p-8 text-xl font-semibold">Dashboard Admin </div>;
const DashboardEstudiante = () => <div className="p-8 text-xl font-semibold">Dashboard Estudiante </div>;
const Unauthorized = () => <div className="p-8 text-red-600 font-semibold">No tienes permiso para acceder a esta página.</div>;

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protegidas — solo usuarios autenticados */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/docente" element={<DashboardDocente />} />
            <Route path="/dashboard/estudiante" element={<DashboardEstudiante />} />
          </Route>

          {/* Protegidas — solo ADMIN */}
          <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
            <Route path="/dashboard/admin" element={<DashboardAdmin />} />
          </Route>

          {/* Ruta raíz */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
