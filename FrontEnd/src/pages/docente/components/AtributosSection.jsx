import { Layers } from "lucide-react";
import { SectionCard } from "../../../components/ui/SectionCard";
import { Label }       from "../../../components/ui/Label";
import {
    ATRIBUTO_LABELS,
    ATRIBUTOS_FECHA,
    ATRIBUTOS_NUMERO,
} from "../productoConfig";

const inputBase =
    "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 " +
    "placeholder-gray-300 dark:placeholder-gray-600 " +
    "focus:outline-none focus:ring-2 focus:ring-[#EFB357]/50 focus:border-[#EFB357] " +
    "transition disabled:opacity-40 disabled:cursor-not-allowed";

const getInputType = (attr) => {
    if (ATRIBUTOS_FECHA.has(attr))  return "date";
    if (ATRIBUTOS_NUMERO.has(attr)) return "number";
    return "text";
};

export const AtributosSection = ({ atributosRequeridos, atributos, onAtributoChange }) => {
    if (atributosRequeridos.length === 0) return null;

    return (
        <SectionCard
            icon={Layers}
            title="Datos específicos del tipo"
            accent="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {atributosRequeridos.map((attr) => {
                    const inputType = getInputType(attr);
                    return (
                        <div key={attr}>
                            <Label required>{ATRIBUTO_LABELS[attr] ?? attr}</Label>
                            <input
                                type={inputType}
                                name={attr}
                                value={atributos[attr] ?? ""}
                                onChange={onAtributoChange}
                                min={inputType === "number" ? 0 : undefined}
                                placeholder={inputType === "date" ? "" : `${ATRIBUTO_LABELS[attr] ?? attr}…`}
                                className={inputBase}
                            />
                        </div>
                    );
                })}
            </div>
        </SectionCard>
    );
};
