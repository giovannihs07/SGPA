import { SgpaBrandMark } from "./SgpaBrandMark";

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
            <div className="relative z-10 px-8 pt-3 pb-8 xl:px-12 xl:pt-4 xl:pb-12 flex-1 flex flex-col justify-between">
                <div>
                    <SgpaBrandMark className="mb-8 xl:mb-5" />
 
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
                <div className="border-t border-[#ffc20e] pt-5 xl:pt-2">
                    <div className="flex gap-6 xl:gap-10">
                        {[
                            { label: 'Docentes', value: '120+' },
                            { label: 'Productos', value: '1.000+' },
                            { label: 'Facultades', value: '9' },
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