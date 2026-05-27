import { Check, X, Loader2 } from "lucide-react";
import { RolesBadge } from "./RolesBadge";
import { nombreCompleto, normalizarRoles } from "../superAdminHelpers";

const perfilLabel = (u) => {
    if (u.docenteId)       return `Docente · ${u.codigoDocente ?? u.docenteId}`;
    if (u.administrativoId) return `Administrativo · ${u.dependencia ?? u.cargo ?? "—"}`;
    return "—";
};

export const AprobacionesTabla = ({ pendientes, procesando, onAprobar, onRechazar }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100
        dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700
                        bg-linear-to-r from-[#ffc20e]/5 to-transparent">
                        {["Solicitante", "Perfil", "Roles", "Registro", "Acciones"].map((h) => (
                            <th key={h}
                                className="px-4 py-3 text-left text-[10px] font-bold uppercase
                                    tracking-widest text-gray-400 whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {pendientes.map((u) => {
                        const uid = u.userId ?? u.id;
                        const busy = procesando === uid;
                        return (
                            <tr key={uid} className="hover:bg-[#ffc20e]/5 transition">
                                <td className="px-4 py-3">
                                    <p className="font-medium text-gray-800 dark:text-gray-100 text-xs">
                                        {nombreCompleto(u)}
                                    </p>
                                    <p className="text-[11px] text-gray-400">{u.email}</p>
                                    <p className="text-[11px] text-gray-400">{u.cedula ?? "—"}</p>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-500">
                                    {perfilLabel(u)}
                                </td>
                                <td className="px-4 py-3">
                                    <RolesBadge roles={normalizarRoles(u.roles)} />
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                                    {u.fechaRegistro
                                        ? new Date(u.fechaRegistro).toLocaleDateString("es-CO")
                                        : "—"}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => onAprobar(u)}
                                            disabled={busy}
                                            title="Aprobar"
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                                text-xs font-semibold text-green-700 bg-green-50
                                                hover:bg-green-100 disabled:opacity-50 transition"
                                        >
                                            {busy ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                            Aprobar
                                        </button>
                                        <button
                                            onClick={() => onRechazar(u)}
                                            disabled={busy}
                                            title="Rechazar"
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                                text-xs font-semibold text-red-600 bg-red-50
                                                hover:bg-red-100 disabled:opacity-50 transition"
                                        >
                                            <X size={12} /> Rechazar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);
