import { Link } from "react-router-dom";
import { ScrollText } from "lucide-react";
import { SuperAdminKpiGrid } from "../SuperAdminKpiGrid";
import { card } from "../../../../components/ui/themeTokens";

const KPI_ICONS = [ScrollText, ScrollText, ScrollText, ScrollText];

export const AuditoriaResumenPanel = ({ kpis, loading }) => (
    <div className={`${card} p-5 space-y-4`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Resumen de auditoría
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Actividad sensible reciente en el sistema
                </p>
            </div>
            <Link
                to="/dashboard/superadmin/auditoria"
                className="text-xs font-semibold text-[#EC7A21] hover:underline shrink-0"
            >
                Ver logs completos →
            </Link>
        </div>

        {loading || kpis.length === 0 ? (
            <SuperAdminKpiGrid
                resumen={kpis.length ? kpis.map((k, i) => ({ ...k, icon: KPI_ICONS[i] })) : [
                    { label: "Eventos (hoy)", value: "…", icon: ScrollText, accent: "bg-gray-100 text-gray-400" },
                ]}
                loading={loading}
            />
        ) : (
            <SuperAdminKpiGrid
                resumen={kpis.map((k, i) => ({ ...k, icon: KPI_ICONS[i] }))}
                loading={loading}
            />
        )}
    </div>
);
