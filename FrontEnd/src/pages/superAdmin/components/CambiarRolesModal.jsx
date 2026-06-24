import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { btnGhost } from "../../../components/ui/themeTokens";
import { ROLE_LABELS, normalizarRoles } from "../superAdminHelpers";

export const CambiarRolesModal = ({ usuario, rolesDisponibles, onClose, onGuardar, saving }) => {
    const [seleccionados, setSeleccionados] = useState([]);

    useEffect(() => {
        setSeleccionados(normalizarRoles(usuario?.roles));
    }, [usuario]);

    if (!usuario) return null;

    const toggle = (rol) => {
        setSeleccionados((prev) =>
            prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol],
        );
    };

    const rolesValidos = seleccionados.filter((r) => rolesDisponibles.includes(r));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Cerrar" />
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                            Cambiar roles
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{usuario.email}</p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>

                {/* Lista de roles disponibles */}
                <div className="space-y-2 mb-5">
                    {/* Se renderiza la lista de roles disponibles */}
                    {rolesDisponibles.map((rol) => (
                        <label
                            key={rol}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40"
                        >
                            {/* Checkbox para seleccionar el rol */}
                            <input
                                type="checkbox"
                                checked={seleccionados.includes(rol)}
                                onChange={() => toggle(rol)}
                                className="rounded border-gray-300 text-[#EC7A21] focus:ring-[#EC7A21]"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-200">
                                {ROLE_LABELS[rol] ?? rol}
                            </span>
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    {/* Botón para cancelar la edición de roles */}
                    <button 
                        type="button"
                        onClick={onClose}
                        className={btnGhost}
                    >
                        Cancelar
                    </button>
                    {/* Botón para guardar los roles seleccionados */}
                    <button
                        type="button"
                        disabled={saving || rolesValidos.length === 0}
                        onClick={() => onGuardar(rolesValidos)}
                        className="px-4 py-2 text-sm font-semibold text-white bg-[#EC7A21] hover:bg-[#d96a15] rounded-lg disabled:opacity-50"
                    >
                        {saving ? "Guardando…" : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
};
