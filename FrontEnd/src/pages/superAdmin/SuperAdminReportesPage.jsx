import { useSuperAdminDashboard } from "../../hooks/superadmin/useSuperAdminDashboard";
import { SuperAdminKpiGrid } from "./components/SuperAdminKpiGrid";
import { BarChart2 } from "lucide-react";

export const SuperAdminReportesPage = () => {
    const { kpis, loading, error } = useSuperAdminDashboard();

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <p>Reportes</p>
        </div>
    );
};
