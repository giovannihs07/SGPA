import { Plus } from "lucide-react";

const labelClass = "block text-xs font-bold text-gray-700 mb-1.5";

/**
 * Encabezado de sección con botón "Añadir" alineado a la derecha.
 *
 * @param {React.ReactNode} title    - Título de la sección (puede incluir JSX)
 * @param {() => void}      onAdd    - Callback al pulsar el botón
 * @param {string}          addLabel - Texto del botón (ej. "Añadir programa")
 */
export const SectionHeader = ({ title, onAdd, addLabel }) => (
    <div className="flex items-center justify-between mb-2">
        <p className={`${labelClass} mb-0`}>{title}</p>
        <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1 text-xs font-semibold text-[#EC7A21] hover:text-[#CF620C] transition"
        >
            <Plus size={13} />
            {addLabel}
        </button>
    </div>
);
