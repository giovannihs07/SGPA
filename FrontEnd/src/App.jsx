import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import  ProtectedRoute from "./routes/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Páginas de autenticación
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

// Páginas de dashboard
const DashboardDocente = () => <div className="p-8 text-xl font-semibold">Dashboard Docente </div>;
const DashboardAdmin = () => <div className="p-8 text-xl font-semibold">Dashboard Admin </div>;
const DashboardSuperAdmin = () => <div className="p-8 text-xl font-semibold">Dashboard SuperAdmin </div>;
const DashboardEstudiante = () => <div className="p-8 text-xl font-semibold">Dashboard Estudiante </div>;
const Unauthorized = () => <div className="p-8 text-red-600 font-semibold">No tienes permiso para acceder a esta página.</div>;

export default function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <Routes>
                        {/* Públicas */}
                        <Route path="/login"        element={<LoginPage />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* Docente */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/docente"           element={<DashboardDocente />} />
                                <Route path="/dashboard/docente/registrar" element={<div>Registrar producto</div>} />
                                <Route path="/dashboard/docente/productos"  element={<div>Mis productos</div>} />
                                <Route path="/dashboard/docente/buscar"     element={<div>Buscar</div>} />
                                <Route path="/dashboard/docente/reportes"   element={<div>Reportes</div>} />
                            </Route>
                        </Route>

                        {/* Estudiante o público general */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/estudiante"          element={<DashboardEstudiante />} />
                                <Route path="/dashboard/estudiante/explorar" element={<div>Explorar</div>} />
                                <Route path="/dashboard/estudiante/buscar"   element={<div>Buscar</div>} />
                            </Route>
                        </Route>

                        {/* Admin */}
                        <Route element={<ProtectedRoute onlyAdmin />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/admin"                  element={<DashboardAdmin />} />
                                <Route path="/dashboard/admin/usuarios"         element={<div>Usuarios</div>} />
                                <Route path="/dashboard/admin/productos"        element={<div>Todos los productos</div>} />
                                <Route path="/dashboard/admin/aprobaciones"     element={<div>Aprobaciones</div>} />
                                <Route path="/dashboard/admin/reportes"         element={<div>Reportes</div>} />
                                <Route path="/dashboard/admin/configuracion"    element={<div>Configuración</div>} />
                            </Route>
                        </Route>

                        {/* SuperAdmin Falta definir*/}
                        <Route element={<ProtectedRoute onlySuperAdmin />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/superadmin"                  element={<DashboardSuperAdmin />} />
                                <Route path="/dashboard/superadmin/usuarios"         element={<div>Usuarios</div>} />
                                <Route path="/dashboard/superadmin/productos"        element={<div>Todos los productos</div>} />
                                <Route path="/dashboard/superadmin/aprobaciones"     element={<div>Aprobaciones</div>} />
                                <Route path="/dashboard/superadmin/reportes"         element={<div>Reportes</div>} />
                                <Route path="/dashboard/superadmin/configuracion"    element={<div>Configuración</div>} />
                            </Route>
                        </Route>

                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

