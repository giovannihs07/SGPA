import { Globe, Clock, Layers } from "lucide-react";

const KpiCard = ({ label, value, icon: Icon, accent }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100
        dark:border-gray-700 p-4 flex items-center gap-4 min-w-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
            <Icon size={18} />
        </div>
        <div className="min-w-0">
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">{value}</p>
            <p className="text-xs text-gray-400 mt-1 truncate">{label}</p>
        </div>
    </div>
);

export const PublicKpiGrid = ({ resumenGlobal }) => (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <KpiCard
            label="Total publicados"
            value={resumenGlobal.total}
            icon={Globe}
            accent="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <KpiCard
            label="Nuevos (30 días)"
            value={resumenGlobal.ultimos30Dias}
            icon={Clock}
            accent="bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20 dark:text-[#EFB357]"
        />
        <KpiCard
            label="Categorías con productos"
            value={resumenGlobal.porCategoria.length}
            icon={Layers}
            accent="bg-[#ffc20e]/15 text-[#EC7A21]"
        />
    </div>
);
