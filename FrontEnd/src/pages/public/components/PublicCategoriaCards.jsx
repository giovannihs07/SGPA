import { BookOpen, FlaskConical, GraduationCap, ChevronRight } from "lucide-react";
import { CATEGORIA_LABELS } from "../../docente/components/productoHelpers";

const ICONOS = {
    INVESTIGATIVO: FlaskConical,
    ACADEMICO: GraduationCap,
    Investigativo: FlaskConical,
    Académico: GraduationCap,
};

const ACCENTOS = {
    INVESTIGATIVO: "from-blue-500/10 to-indigo-500/5 border-blue-200/60 dark:border-blue-800/40",
    ACADEMICO: "from-emerald-500/10 to-teal-500/5 border-emerald-200/60 dark:border-emerald-800/40",
    Investigativo: "from-blue-500/10 to-indigo-500/5 border-blue-200/60 dark:border-blue-800/40",
    Académico: "from-emerald-500/10 to-teal-500/5 border-emerald-200/60 dark:border-emerald-800/40",
};

const contarPorCategoria = (productos, nombreCategoria) =>
    productos.filter((p) => p.categoria === nombreCategoria).length;

export const PublicCategoriaCards = ({
    schema,
    productos,
    filtroCategoria,
    onSelectCategoria,
    onVerTodos,
}) => {
    const categorias = schema?.length
        ? schema.map((c) => ({
            nombre: c.nombre,
            count: contarPorCategoria(productos, c.nombre),
        }))
        : [...new Set(productos.map((p) => p.categoria).filter(Boolean))].map((nombre) => ({
            nombre,
            count: contarPorCategoria(productos, nombre),
        }));

    if (!categorias.length) return null;

    return (
        <section aria-labelledby="explorar-categorias-titulo">
            <div className="flex items-center justify-between gap-3 mb-3">
                <h2
                    id="explorar-categorias-titulo"
                    className="text-sm font-bold text-gray-900 dark:text-white"
                >
                    Explorar por categoría
                </h2>
                {filtroCategoria !== "TODAS" && (
                    <button
                        type="button"
                        onClick={onVerTodos}
                        className="text-xs font-medium text-[#EC7A21] hover:underline"
                    >
                        Ver todas
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categorias.map(({ nombre, count }) => {
                    const Icon = ICONOS[nombre] ?? BookOpen;
                    const label = CATEGORIA_LABELS[nombre] ?? nombre;
                    const accent = ACCENTOS[nombre] ?? "from-gray-100 to-gray-50 border-gray-200 dark:border-gray-600";
                    const activa = filtroCategoria === nombre;

                    return (
                        <button
                            key={nombre}
                            type="button"
                            onClick={() => onSelectCategoria(nombre)}
                            className={`group text-left rounded-2xl border bg-linear-to-br p-4 sm:p-5 transition
                                hover:shadow-md hover:border-[#ffc20e]/50
                                ${accent}
                                ${activa ? "ring-2 ring-[#EC7A21]/40 border-[#EC7A21]/50" : ""}`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="w-11 h-11 rounded-xl bg-[#222222] flex items-center justify-center shrink-0">
                                    <Icon size={20} className="text-[#ffc20e]" />
                                </div>
                                <ChevronRight
                                    size={18}
                                    className="text-gray-300 group-hover:text-[#EC7A21] transition shrink-0 mt-1"
                                />
                            </div>
                            <p className="text-base font-bold text-gray-900 dark:text-white mt-3">
                                {label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {count === 1 ? "1 producto publicado" : `${count} productos publicados`}
                            </p>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};
