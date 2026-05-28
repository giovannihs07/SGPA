import { Tag, FlaskConical, BookOpen, ChevronDown } from "lucide-react";
import { Label } from "../../../components/ui/Label";
import { card, cardHeaderBorder, selectSm, focusRing } from "../../../components/ui/themeTokens";
import {
    CATEGORIA_LABELS,
    SUBCATEGORIA_LABELS,
    TIPO_LABELS,
} from "../productoConfig";

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
/**
 * Sección de clasificación en cascada: categoría → subcategoría → tipo.
 *
 * @param {object}   form                    - Estado del formulario (categoria, subcategoria, tipo)
 * @param {Function} handleChange            - Handler genérico del formulario
 * @param {string[]} subcategoriasDisponibles
 * @param {string[]} tiposDisponibles
 */
export const ClasificacionSection = ({
    form,
    handleChange,
    subcategoriasDisponibles,
    tiposDisponibles,
}) => (
    <div className={card}>
        <div className={`flex items-center gap-2.5 px-5 py-3.5 ${cardHeaderBorder} text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10`}>
            <Tag size={15} className="shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest">Clasificación del producto</span>
        </div>
 
        <div className="p-5 space-y-4">
 
            {/* Categoría — radio buttons */}
            <div>
                <Label required>Categoría</Label>
                <div className="grid grid-cols-2 gap-3">
                    {Object.entries(CATEGORIA_LABELS).map(([key, label]) => {
                        const active = form.categoria === key;
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() =>
                                    handleChange({ target: { name: "categoria", value: key } })
                                }
                                className={`
                                    flex items-center gap-2.5 px-4 py-3 rounded-lg border-2
                                    text-sm font-medium transition text-left ${focusRing}
                                    ${active
                                        ? "border-[#EFB357] bg-amber-50 dark:bg-amber-900/20 text-gray-900 dark:text-gray-50"
                                        : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                                    }
                                `}
                            >
                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition
                                    ${active ? "border-[#EFB357]" : "border-gray-300"}`}>
                                    {active && <div className="w-2 h-2 rounded-full bg-[#EFB357]" />}
                                </div>
                                {key === "INVESTIGATIVO"
                                    ? <FlaskConical size={14} className="shrink-0" />
                                    : <BookOpen size={14} className="shrink-0" />
                                }
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
 
            {/* Subcategoría */}
            <div>
                <Label required>Subcategoría</Label>
                <SelectField
                    name="subcategoria"
                    value={form.subcategoria}
                    onChange={handleChange}
                    disabled={!form.categoria}
                    placeholder={form.categoria ? "Selecciona una subcategoría" : "— elige categoría primero —"}
                >
                    {subcategoriasDisponibles.map((sub) => (
                        <option key={sub} value={sub}>
                            {SUBCATEGORIA_LABELS[sub] ?? sub}
                        </option>
                    ))}
                </SelectField>
            </div>
 
            {/* Tipo */}
            <div>
                <Label required>Tipo de producto</Label>
                <SelectField
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    disabled={!form.subcategoria}
                    placeholder={form.subcategoria ? "Selecciona el tipo" : "— elige subcategoría primero —"}
                >
                    {tiposDisponibles.map((t) => (
                        <option key={t} value={t}>
                            {TIPO_LABELS[t] ?? t}
                        </option>
                    ))}
                </SelectField>
            </div>
 
        </div>
    </div>
);