import { Layers } from "lucide-react";
import { SectionCard } from "../../../components/ui/SectionCard";
import { Label } from "../../../components/ui/Label";
import { inputDense, selectSm } from "../../../components/ui/themeTokens";

const inputTypeFor = (tipoDato) => {
    switch (tipoDato) {
        case "NUMBER": return "number";
        case "DATE":   return "date";
        default:       return "text";
    }
};

const CampoAtributo = ({ def, valor, onAtributoChange }) => {
    const { nombreAtributo, etiqueta, tipoDato, requerido, opciones } = def;

    if (tipoDato === "BOOLEAN") {
        const checked = valor === true || valor === "true";
        return (
            <div className="flex items-center gap-2 sm:col-span-2">
                <input
                    type="checkbox"
                    id={`attr-${nombreAtributo}`}
                    name={nombreAtributo}
                    checked={checked}
                    onChange={onAtributoChange}
                    className="rounded border-gray-300 text-[#EC7A21] focus:ring-[#EFB357]"
                />
                <label htmlFor={`attr-${nombreAtributo}`} className="text-sm text-gray-700 dark:text-gray-300">
                    {etiqueta}{requerido ? " *" : ""}
                </label>
            </div>
        );
    }

    if (tipoDato === "SELECT" && opciones) {
        const opts = opciones.split(",").map((o) => o.trim()).filter(Boolean);
        return (
            <div>
                <Label required={requerido}>{etiqueta}</Label>
                <select
                    name={nombreAtributo}
                    value={valor ?? ""}
                    onChange={onAtributoChange}
                    className={selectSm}
                >
                    <option value="" disabled>Seleccionar…</option>
                    {opts.map((op) => (
                        <option key={op} value={op}>{op}</option>
                    ))}
                </select>
            </div>
        );
    }

    const inputType = inputTypeFor(tipoDato);
    return (
        <div>
            <Label required={requerido}>{etiqueta}</Label>
            <input
                type={inputType}
                name={nombreAtributo}
                value={valor ?? ""}
                onChange={onAtributoChange}
                min={inputType === "number" ? 0 : undefined}
                placeholder={inputType === "date" ? "" : `${etiqueta}…`}
                className={inputDense}
            />
        </div>
    );
};

export const AtributosSection = ({ atributosDef, atributos, onAtributoChange }) => {
    if (!atributosDef?.length) return null;

    return (
        <SectionCard
            icon={Layers}
            title="Datos específicos del tipo"
            accent="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {atributosDef.map((def) => (
                    <CampoAtributo
                        key={def.nombreAtributo}
                        def={def}
                        valor={atributos[def.nombreAtributo]}
                        onAtributoChange={onAtributoChange}
                    />
                ))}
            </div>
        </SectionCard>
    );
};
