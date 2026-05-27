import { BookOpen, Globe, FileCheck, Clock } from "lucide-react";

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

export const MisProductosKpiGrid = ({ resumen }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Total productos"  value={resumen.total}         icon={BookOpen}  accent="bg-[#ffc20e]/15 text-[#EC7A21]" />
        <KpiCard label="Publicados"       value={resumen.publicados}    icon={Globe}     accent="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
        <KpiCard label="Sin publicar"     value={resumen.sinPublicar}   icon={FileCheck} accent="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" />
        <KpiCard label="Nuevos (30 días)" value={resumen.ultimos30Dias} icon={Clock}     accent="bg-orange-50 text-[#EC7A21] dark:bg-orange-900/20 dark:text-[#EFB357]" />
    </div>
);
