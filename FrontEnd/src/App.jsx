import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { ToastProvider } from "./context/ToastProvider";
import ProtectedRoute from "./routes/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
 
// Páginas de autenticación
import { LoginPage }    from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";
 
// Páginas de docente
import { DashboardDocentePage }  from "./pages/docente/DashboardDocentePage";
import { RegistrarProductoPage } from "./pages/docente/registrarProductoPage";
import { MisProductosPage }      from "./pages/docente/MisProductosPage";
import { EditarProductoPage }    from "./pages/docente/EditarProductoPage";
import { ReportesDocentePage }   from "./pages/docente/ReportesDocentePage";
import { DashboardDocenteAdminPage } from "./pages/docenteAdmin/DashboardDocenteAdminPage";
 
// Páginas de super admin
import { DashboardSuperAdminPage }    from "./pages/superAdmin/DashboardSuperAdminPage";
import { SuperAdminUsuariosPage }     from "./pages/superAdmin/SuperAdminUsuariosPage";
import { SuperAdminProductosPage }    from "./pages/superAdmin/SuperAdminProductosPage";
import { SuperAdminReportesPage }     from "./pages/superAdmin/SuperAdminReportesPage";
import { SuperAdminConfiguracionPage } from "./pages/superAdmin/SuperAdminConfiguracionPage";
import { SuperAdminAuditoriaPage } from "./pages/superAdmin/SuperAdminAuditoriaPage";
 
// Páginas de admin
import { DashboardAdminPage }        from "./pages/admin/DashboardAdminPage";
import { AdminUsuariosPage }         from "./pages/admin/AdminUsuariosPage";
import { AdminProductosPage }        from "./pages/admin/AdminProductosPage";
import { AdminReportesPage }         from "./pages/admin/AdminReportesPage";
 
// Portal público (sin autenticación)
import { PublicLayout } from "./components/layout/PublicLayout";
import { PortalPublicPage } from "./pages/public/PortalPublicPage";
import { ProductoPublicoDetallePage } from "./pages/public/ProductoPublicoDetallePage";
import { AcercaDePublicPage } from "./pages/public/AcercaDePublicPage";

// Perfil de usuario
import { MiPerfilPage } from "./pages/perfil/MiPerfilPage";
 
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
                        {/* Autenticación */}
                        <Route path="/login"        element={<LoginPage />} />
                        <Route path="/register"     element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password"  element={<ResetPasswordPage />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* Portal público — sin login */}
                        <Route element={<PublicLayout />}>
                            <Route path="/portal/public" element={<PortalPublicPage />} />
                            <Route path="/portal/public/acerca" element={<AcercaDePublicPage />} />
                            <Route path="/portal/public/productos/:id" element={<ProductoPublicoDetallePage />} />
                        </Route>
 
                        {/* Docente administrativo — dashboard combinado */}
                        <Route element={<ProtectedRoute onlyDocenteAdmin />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/docente-admin" element={<DashboardDocenteAdminPage />} />
                            </Route>
                        </Route>

                        {/* Docente */}
                        <Route element={<ProtectedRoute onlyDocente />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/docente"            element={<DashboardDocentePage />} />
                                <Route path="/dashboard/docente/registrar"  element={<RegistrarProductoPage />} />
                                <Route path="/dashboard/docente/productos"          element={<MisProductosPage />} />
                                <Route path="/dashboard/docente/productos/:id/editar" element={<EditarProductoPage />} />
                                <Route path="/dashboard/docente/reportes"   element={<ReportesDocentePage />} />
                            </Route>
                        </Route>
 
                        {/* Perfil — cualquier usuario autenticado */}
                        <Route element={<ProtectedRoute />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/perfil" element={<MiPerfilPage />} />
                            </Route>
                        </Route>
 
                        {/* Admin */}
                        <Route element={<ProtectedRoute onlyAdmin />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/admin"               element={<DashboardAdminPage />} />
                                <Route path="/dashboard/admin/usuarios"      element={<AdminUsuariosPage />} />
                                <Route path="/dashboard/admin/productos"     element={<AdminProductosPage />} />
                                <Route path="/dashboard/admin/reportes"      element={<AdminReportesPage />} />
                            </Route>
                        </Route>
 
                        {/* SuperAdmin */}
                        <Route element={<ProtectedRoute onlySuperAdmin />}>
                            <Route element={<DashboardLayout />}>
                                <Route path="/dashboard/superadmin"               element={<DashboardSuperAdminPage />} />
                                <Route path="/dashboard/superadmin/usuarios"      element={<SuperAdminUsuariosPage />} />
                                <Route path="/dashboard/superadmin/productos"     element={<SuperAdminProductosPage />} />
                                <Route path="/dashboard/superadmin/reportes"     element={<SuperAdminReportesPage />} />
                                <Route path="/dashboard/superadmin/auditoria"   element={<SuperAdminAuditoriaPage />} />
                                <Route path="/dashboard/superadmin/configuracion" element={<SuperAdminConfiguracionPage />} />
                            </Route>
                        </Route>
 
                        <Route path="/" element={<Navigate to="/portal/public" replace />} />
                        <Route path="*" element={<Navigate to="/portal/public" replace />} />
                        </Routes>
                    </AuthProvider>
                </ToastProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

