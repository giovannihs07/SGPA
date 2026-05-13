const stats = [
    { label: 'Docentes',   value: '120+'   },
    { label: 'Productos',  value: '1.400+' },
    { label: 'Facultades', value: '7'      },
];

export const InstitutionalPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-[#003366] flex-col justify-between p-12 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full border-40 border-[#C8963E] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full border-30 border-[#C8963E] -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Título e identidad */}
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#C8963E] rounded-sm flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                    </svg>
                </div>
                <span className="text-[#C8963E] font-semibold text-sm tracking-widest uppercase">
                    Unicartagena
                </span>
            </div>
            <h1 className="text-white text-4xl font-bold leading-tight mt-6">
                Sistema de Gestión<br />
                <span className="text-[#C8963E]">de Producción</span><br />
                Académica
            </h1>
            <p className="text-blue-200 text-sm mt-4 leading-relaxed max-w-xs">
                Centraliza, organiza y reporta la producción docente de la Facultad de Ingeniería.
            </p>
        </div>

        {/* Estadísticas */}
        <div className="relative z-10 border-t border-blue-700 pt-6">
            <div className="flex gap-8">
                {stats.map((s) => (
                    <div key={s.label}>
                        <p className="text-[#C8963E] text-xl font-bold">{s.value}</p>
                        <p className="text-blue-300 text-xs">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
