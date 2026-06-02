import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { ToastProvider } from "./context/ToastProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
 
// Páginas de autenticación
import { LoginPage }    from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
 
// Páginas de docente
import { DashboardDocentePage }  from "./pages/docente/DashboardDocentePage";
import { RegistrarProductoPage } from "./pages/docente/registrarProductoPage";
import { MisProductosPage }      from "./pages/docente/MisProductosPage";
import { EditarProductoPage }    from "./pages/docente/EditarProductoPage";
import { BuscarDocentePage }     from "./pages/docente/BuscarDocentePage";
import { ReportesDocentePage }   from "./pages/docente/ReportesDocentePage";
 
// Páginas de super admin
import { DashboardSuperAdminPage }    from "./pages/superAdmin/DashboardSuperAdminPage";
import { SuperAdminUsuariosPage }     from "./pages/superAdmin/SuperAdminUsuariosPage";
import { SuperAdminAprobacionesPage } from "./pages/superAdmin/SuperAdminAprobacionesPage";
import { SuperAdminProductosPage }    from "./pages/superAdmin/SuperAdminProductosPage";
import { SuperAdminReportesPage }     from "./pages/superAdmin/SuperAdminReportesPage";
import { SuperAdminConfiguracionPage } from "./pages/superAdmin/SuperAdminConfiguracionPage";
import { SuperAdminAuditoriaPage } from "./pages/superAdmin/SuperAdminAuditoriaPage";
 
// Páginas de admin
import { DashboardAdminPage }        from "./pages/admin/DashboardAdminPage";
import { AdminUsuariosPage }         from "./pages/admin/AdminUsuariosPage";
import { AdminProductosPage }        from "./pages/admin/AdminProductosPage";
import { AdminAprobacionesPage }     from "./pages/admin/AdminAprobacionesPage";
import { AdminReportesPage }         from "./pages/admin/AdminReportesPage";
 
// Páginas de estudiante o público general
import { DashboardPublicPage } from "./pages/public/DashboardPublicPage";
 
// Utilidades
const Unauthorized = () => (
    <div className="p-8 text-red-600 font-semibold">
        No tienes permiso para acceder a esta página.
    </div>
);
 
export default function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <Routes>
                        {/* Públicas */}
                        <Route path="/login"        element={<LoginPage />} />
                        <Route path="/register"     element={<RegisterPage />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />
 
                        {/* Docente */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/docente"            element={<DashboardDocentePage />} />
                                <Route path="/dashboard/docente/registrar"  element={<RegistrarProductoPage />} />
                                <Route path="/dashboard/docente/productos"          element={<MisProductosPage />} />
                                <Route path="/dashboard/docente/productos/:id/editar" element={<EditarProductoPage />} />
                                <Route path="/dashboard/docente/buscar"     element={<BuscarDocentePage />} />
                                <Route path="/dashboard/docente/reportes"   element={<ReportesDocentePage />} />
                            </Route>
                        </Route>
 
                        {/* Estudiante o Público general */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/public"          element={<DashboardPublicPage />} />
                                <Route path="/dashboard/public/explorar" element={<div>Explorar</div>} />
                                <Route path="/dashboard/public/buscar"   element={<div>Buscar</div>} />
                            </Route>
                        </Route>
 
                        {/* Admin */}
                        <Route element={<ProtectedRoute onlyAdmin />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/admin"               element={<DashboardAdminPage />} />
                                <Route path="/dashboard/admin/usuarios"      element={<AdminUsuariosPage />} />
                                <Route path="/dashboard/admin/productos"     element={<AdminProductosPage />} />
                                <Route path="/dashboard/admin/aprobaciones"  element={<AdminAprobacionesPage />} />
                                <Route path="/dashboard/admin/reportes"      element={<AdminReportesPage />} />
                            </Route>
                        </Route>
 
                        {/* SuperAdmin */}
                        <Route element={<ProtectedRoute onlySuperAdmin />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/superadmin"               element={<DashboardSuperAdminPage />} />
                                <Route path="/dashboard/superadmin/usuarios"      element={<SuperAdminUsuariosPage />} />
                                <Route path="/dashboard/superadmin/productos"     element={<SuperAdminProductosPage />} />
                                <Route path="/dashboard/superadmin/aprobaciones"  element={<SuperAdminAprobacionesPage />} />
                                <Route path="/dashboard/superadmin/reportes"     element={<SuperAdminReportesPage />} />
                                <Route path="/dashboard/superadmin/auditoria"   element={<SuperAdminAuditoriaPage />} />
                                <Route path="/dashboard/superadmin/configuracion" element={<SuperAdminConfiguracionPage />} />
                            </Route>
                        </Route>
 
                        <Route path="/"  element={<Navigate to="/login" replace />} />
                        <Route path="*"  element={<Navigate to="/login" replace />} />
                        </Routes>
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

