import { Tag, FlaskConical, BookOpen, ChevronDown } from "lucide-react";
import { Label } from "../../../components/ui/Label";
import { card, cardHeaderBorder, selectSm, focusRing } from "../../../components/ui/themeTokens";

const SelectField = ({ name, value, onChange, disabled, placeholder, children }) => (
    <div className="relative">
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${selectSm} pr-9 ${disabled ? "bg-gray-100 dark:bg-gray-900" : ""}`}
        >
            <option value="" disabled>{placeholder}</option>
            {children}
        </select>
        <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
        />
    </div>
);

const esCategoriaInvestigativa = (nombre) =>
    nombre?.toLowerCase().includes("investigativ");

/**
 * Clasificación en cascada: categoría → subcategoría → tipo (taxonomía dinámica).
 */
export const ClasificacionSection = ({
    form,
    handleChange,
    categoriasDisponibles,
    subcategoriasDisponibles,
    tiposDisponibles,
}) => (
    <div className={card}>
        <div className={`flex items-center gap-2.5 px-5 py-3.5 ${cardHeaderBorder} text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10`}>
            <Tag size={15} className="shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest">Clasificación del producto</span>
        </div>

        <div className="p-5 space-y-4">
            <div>
                <Label required>Categoría</Label>
                {categoriasDisponibles.length <= 2 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categoriasDisponibles.map((cat) => {
                            const active = String(form.categoriaId) === String(cat.id);
                            const investigativa = esCategoriaInvestigativa(cat.nombre);
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() =>
                                        handleChange({
                                            target: { name: "categoriaId", value: String(cat.id) },
                                        })
                                    }
                                    className={`
                                        flex items-center gap-2.5 px-4 py-3 rounded-lg border-2
                                        text-sm font-medium transition text-left ${focusRing}
                                        ${active
                                            ? "border-[#EFB357] bg-amber-50 dark:bg-amber-900/20 text-gray-900 dark:text-gray-50"
                                            : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400"
                                        }
                                    `}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                                        ${active ? "border-[#EFB357]" : "border-gray-300"}`}>
                                        {active && <div className="w-2 h-2 rounded-full bg-[#EFB357]" />}
                                    </div>
                                    {investigativa
                                        ? <FlaskConical size={14} className="shrink-0" />
                                        : <BookOpen size={14} className="shrink-0" />
                                    }
                                    {cat.nombre}
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <SelectField
                        name="categoriaId"
                        value={form.categoriaId}
                        onChange={handleChange}
                        placeholder="Selecciona una categoría"
                    >
                        {categoriasDisponibles.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </SelectField>
                )}
            </div>

            <div>
                <Label required>Subcategoría</Label>
                <SelectField
                    name="subcategoriaId"
                    value={form.subcategoriaId}
                    onChange={handleChange}
                    disabled={!form.categoriaId}
                    placeholder={form.categoriaId ? "Selecciona una subcategoría" : "— elige categoría primero —"}
                >
                    {subcategoriasDisponibles.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.nombre}</option>
                    ))}
                </SelectField>
            </div>

            <div>
                <Label required>Tipo de producto</Label>
                <SelectField
                    name="tipoProductoId"
                    value={form.tipoProductoId}
                    onChange={handleChange}
                    disabled={!form.subcategoriaId}
                    placeholder={form.subcategoriaId ? "Selecciona el tipo" : "— elige subcategoría primero —"}
                >
                    {tiposDisponibles.map((t) => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                    ))}
                </SelectField>
            </div>
        </div>
    </div>
);
