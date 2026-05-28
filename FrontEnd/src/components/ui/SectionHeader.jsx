import { Plus } from "lucide-react";
import { labelBold, btnText } from "./themeTokens";

/**
 * Encabezado de sección con botón "Añadir" alineado a la derecha.
 */
export const SectionHeader = ({ title, onAdd, addLabel }) => (
    <div className="flex items-center justify-between mb-2">
        <p className={`${labelBold} mb-0`}>{title}</p>
        <button type="button" onClick={onAdd} className={`flex items-center gap-1 ${btnText}`}>
            <Plus size={13} aria-hidden="true" />
            {addLabel}
        </button>
    </div>
);
