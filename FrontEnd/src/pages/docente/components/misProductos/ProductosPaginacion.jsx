import { ChevronLeft, ChevronRight } from "lucide-react";
import { tablePaginationBar, text } from "../../../../components/ui/themeTokens";

export const ProductosPaginacion = ({ pagina, totalPaginas, totalItems, pageSize, irPagina }) => {
    if (totalItems === 0) return null;

    const inicio = pagina * pageSize + 1;
    const fin    = Math.min((pagina + 1) * pageSize, totalItems);

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${tablePaginationBar}`}>
            <p className={`text-xs ${text.muted}`}>
                Mostrando <span className={`font-semibold ${text.secondary}`}>{inicio}–{fin}</span>
                {" "}de <span className={`font-semibold ${text.secondary}`}>{totalItems}</span>
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => irPagina(pagina - 1)}
                    disabled={pagina === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                        text-gray-500 hover:bg-white dark:hover:bg-gray-700
                        disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => irPagina(i)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition
                            ${i === pagina
                                ? "bg-[#EC7A21] text-white shadow-sm"
                                : "text-gray-500 hover:bg-white dark:hover:bg-gray-700"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => irPagina(pagina + 1)}
                    disabled={pagina >= totalPaginas - 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                        text-gray-500 hover:bg-white dark:hover:bg-gray-700
                        disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};
