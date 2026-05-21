export const InstitutionalPanel = ({ side = "right" }) => {
    return (
        <div className={`hidden lg:flex lg:w-1/2 bg-[#2B2B2B] flex-col relative overflow-hidden ${side === "left" ? "order-first" : "order-last"}`}>
 
            {/* Overlay imagen campus fondo */}
            <div className="absolute inset-0">
                <img
                    src="/campus-unicartagena.jpg"
                    alt="Campus Universidad de Cartagena"
                    className="w-full h-full object-cover opacity-20 mix-blend-multiply"
                    onError={(e) => e.target.style.display = 'none'}
                />
            </div>
 
            {/* Contenido */}
            <div className="relative z-10 p-8 xl:p-12 flex-1 flex flex-col justify-between">
                <div>
                    {/* Logo SGPA */}
                    <div className="flex items-center gap-3 mb-8 xl:mb-10">
                        <div className="w-9 h-9 xl:w-10 xl:h-10 bg-[#ffc20e] rounded-md flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 xl:w-6 xl:h-6 fill-white">
                                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                            </svg>
                        </div>
                        <span className="text-[#ffc20e] font-bold text-xs tracking-widest uppercase">
                            SGPA Unicartagena
                        </span>
                    </div>
 
                    {/* Título principal */}
                    <h2 className="text-white text-2xl xl:text-2xl font-bold leading-tight">
                        Sistema de Gestión<br/>
                        <span className="text-[#ffc20e]"> de Produccion </span>
                        Académica.
                    </h2>
                    <p className="text-white text-sm mt-3 xl:mt-4 leading-relaxed max-w-xs">
                        Centraliza, organiza y reporta tu producción académica
                    </p>
                </div>
 
                {/* Imagen campus parte inferior */}
                <div className="my-4 xl:my-4">
                    <img
                        src="/campus-piedra.webp"
                        alt="Campus Universidad de Cartagena"
                        className="w-full rounded-lg object-contain opacity-60"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                </div>
 
                {/* Stats */}
                <div className="border-t border-[#ffc20e] pt-5 xl:pt-6">
                    <div className="flex gap-6 xl:gap-10">
                        {[
                            { label: 'Docentes', value: '120+' },
                            { label: 'Productos', value: '1.400+' },
                            { label: 'Facultades', value: '7' },
                        ].map((s) => (
                            <div key={s.label}>
                                <p className="text-[#ffc20e] text-lg xl:text-xl font-bold">{s.value}</p>
                                <p className="text-white text-xs mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
 
        </div>
    );
};