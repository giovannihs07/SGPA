const KpiCard = ({ label, value, icon: Icon, accent, loading }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100
        dark:border-gray-700 p-4 flex items-center gap-4 min-w-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
            <Icon size={18} />
        </div>
        <div className="min-w-0">
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
                {loading ? "…" : value}
            </p>
            <p className="text-xs text-gray-400 mt-1 truncate">{label}</p>
        </div>
    </div>
);

export const SuperAdminKpiGrid = ({ resumen, loading }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {resumen.map(({ label, value, icon, accent }) => (
            <KpiCard
                key={label}
                label={label}
                value={value}
                icon={icon}
                accent={accent}
                loading={loading}
            />
        ))}
    </div>
);
