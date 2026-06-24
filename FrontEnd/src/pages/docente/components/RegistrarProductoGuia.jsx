import { Info } from "lucide-react";
import { ETIQUETA_FORMATOS_ARCHIVO } from "../../../config/productoArchivo";

const PUNTOS = [
    "Al registrar, el producto queda sin publicar hasta que lo publiques desde Mis productos.",
    "La clasificación (categoría → subcategoría → tipo) esta basada en la clasificación de Minciencias y determina los campos adicionales y los archivos que debes adjuntar.",
    `Adjunta al menos un archivo principal. Formatos admitidos: ${ETIQUETA_FORMATOS_ARCHIVO}.`,
    "Puedes editar la información después desde Mis productos.",
];

export const RegistrarProductoGuia = () => (
    <div
        className="rounded-xl border border-amber-200 dark:border-amber-800
            bg-amber-50 dark:bg-amber-900/20 px-4 py-4"
        role="note"
    >
        <div className="flex items-start gap-3">
            <Info size={18} className="text-amber-700 dark:text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                    Antes de empezar
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-amber-900/90 dark:text-amber-100/90 list-disc pl-4">
                    {PUNTOS.map((texto) => (
                        <li key={texto}>{texto}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);
