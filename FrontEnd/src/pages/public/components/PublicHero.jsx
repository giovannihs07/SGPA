import { Search, ChevronDown } from "lucide-react";
import { focusRing } from "../../../components/ui/themeTokens";
import { SgpaBrandMark } from "../../../components/ui/SgpaBrandMark";

const Stat = ({ value, label }) => (
    <div className="text-center sm:text-left">
        <p className="text-[#ffc20e] text-xl sm:text-2xl font-bold leading-none">{value}</p>
        <p className="text-white/70 text-xs mt-1">{label}</p>
    </div>
);

export const PublicHero = ({
    resumenGlobal,
    categoriasActivas = 0,
    busqueda,
    onBusquedaChange,
    onExplorar,
    onBuscar,
}) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        onBuscar?.();
    };

    return (
        <section
            aria-labelledby="public-hero-title"
            className="relative overflow-hidden bg-[#2B2B2B]"
        >
            <div className="absolute inset-0">
                <img
                    src="/campus-piedra.webp"
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover opacity-25 mix-blend-luminosity"
                    onError={(e) => { e.target.style.display = "none"; }}
                />
                <div className="absolute inset-0 bg-linear-to-br from-[#2B2B2B]/95 via-[#2B2B2B]/85 to-[#1a1a1a]/90" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <SgpaBrandMark size="large" className="mb-4 sm:mb-5" />
                <p className="text-white/60 text-[10px] sm:text-xs mb-4">
                    Portal público de producción académica
                </p>

                <h1
                    id="public-hero-title"
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight max-w-3xl"
                >
                    Producción académica de la{" "}
                    <span className="text-[#ffc20e]">Universidad de Cartagena</span>
                </h1>
                <p className="text-white/75 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
                    Explora y consulta los productos académicos que los docentes han publicado
                    para la comunidad universitaria.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 max-w-xl flex gap-2">
                    <div className="relative flex-1 min-w-0">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            aria-hidden="true"
                        />
                        <input
                            type="search"
                            value={busqueda}
                            onChange={(e) => onBusquedaChange(e.target.value)}
                            placeholder="Buscar y presionar Enter…"
                            aria-label="Buscar producción académica"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/95 text-gray-900
                                placeholder-gray-400 text-sm shadow-lg
                                focus:outline-none focus:ring-2 focus:ring-[#ffc20e]/60"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`shrink-0 px-5 py-3.5 rounded-xl text-sm font-semibold
                            bg-[#EC7A21] text-white hover:bg-[#d96a15] transition ${focusRing}`}
                    >
                        Buscar
                    </button>
                </form>

                <div className="flex flex-wrap items-center gap-4 mt-5">
                    <button
                        type="button"
                        onClick={onExplorar}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                            bg-[#EC7A21] text-white hover:bg-[#d96a15] transition ${focusRing}`}
                    >
                        Explorar catálogo
                        <ChevronDown size={16} aria-hidden="true" />
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-[#ffc20e]/30 flex flex-wrap gap-8 sm:gap-12">
                    <Stat value={resumenGlobal.total} label="Productos publicados" />
                    <Stat value={resumenGlobal.ultimos30Dias} label="Nuevos (30 días)" />
                    <Stat value={categoriasActivas} label="Categorías activas" />
                </div>
            </div>
        </section>
    );
};
