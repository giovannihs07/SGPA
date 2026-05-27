import { useState, useEffect } from "react";
import { X, UserCheck, Info } from "lucide-react";
import { ROLE_LABELS, normalizarRoles, nombreCompleto } from "../superAdminHelpers";
import { RolesBadge } from "./RolesBadge";

const perfilLabel = (u) => {
    if (u?.docenteId)        return `Docente · ${u.codigoDocente ?? u.docenteId}`;
    if (u?.administrativoId) return `Administrativo · ${u.dependencia ?? u.cargo ?? "—"}`;
    return "Sin perfil asociado";
};

export const AprobarUsuarioModal = ({
    usuario,
    rolesDisponibles,
    onClose,
    onAprobar,
    saving,
}) => {
    const [seleccionados, setSeleccionados] = useState([]);

    useEffect(() => {
        setSeleccionados(normalizarRoles(usuario?.roles));
    }, [usuario]);

    if (!usuario) return null;

    const userId = usuario.userId ?? usuario.id;

    const toggle = (rol) => {
        setSeleccionados((prev) =>
            prev.includes(rol) ? prev.filter((r) => r !== rol) : [...prev, rol],
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Cerrar" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-linear-to-r from-green-50 to-[#ffc20e]/10">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <UserCheck size={18} className="text-green-600" />
                                Aprobar registro
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Confirma los roles antes de activar la cuenta
                            </p>
                        </div>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl px-4 py-3 space-y-2">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {nombreCompleto(usuario)}
                        </p>
                        <p className="text-xs text-gray-500">{usuario.email}</p>
                        <p className="text-xs text-gray-400">Cédula: {usuario.cedula ?? "—"}</p>
                        <p className="text-xs text-gray-400">{perfilLabel(usuario)}</p>
                        <div className="pt-1">
                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Roles solicitados</p>
                            <RolesBadge roles={normalizarRoles(usuario.roles)} />
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">
                            Roles a asignar *
                        </p>
                        <div className="space-y-2">
                            {rolesDisponibles.map((rol) => (
                                <label
                                    key={rol}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900/40"
                                >
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
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                        <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                            El usuario podrá iniciar sesión con los roles seleccionados.
                            Puedes ajustarlos antes de aprobar.
                        </p>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-2">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={saving || seleccionados.length === 0}
                        onClick={() => onAprobar(userId, seleccionados)}
                        className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
                    >
                        {saving ? "Aprobando…" : "Aprobar y activar"}
                    </button>
                </div>
            </div>
        </div>
    );
};
