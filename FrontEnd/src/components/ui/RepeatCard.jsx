import { Trash2 } from "lucide-react";

/**
 * Tarjeta con borde para ítems de una lista repetible.
 * Muestra el botón eliminar solo cuando hay más de un ítem.
 *
 * @param {number}      index    - Índice del ítem en la lista
 * @param {number}      total    - Total de ítems en la lista
 * @param {(i) => void} onRemove - Callback para eliminar el ítem en `index`
 */
export const RepeatCard = ({ index, total, onRemove, children }) => (
    <div className="relative border-2 border-[#e0d3d3] rounded-md p-3 space-y-2.5">
        {total > 1 && (
            <button
                type="button"
                onClick={() => onRemove(index)}
                title="Eliminar"
                className="absolute top-2 right-2 text-gray-300 hover:text-red-400 transition"
            >
                <Trash2 size={14} />
            </button>
        )}
        {children}
    </div>
);

