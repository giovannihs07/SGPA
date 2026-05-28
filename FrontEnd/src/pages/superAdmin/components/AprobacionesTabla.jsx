import { Check, X, Loader2 } from "lucide-react";
import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellMuted, tableCellSubtext,
} from "../../../components/ui/themeTokens";
import { RolesBadge } from "./RolesBadge";
import { nombreCompleto, normalizarRoles } from "../superAdminHelpers";

const perfilLabel = (u) => {
    if (u.docenteId)       return `Docente · ${u.codigoDocente ?? u.docenteId}`;
    if (u.administrativoId) return `Administrativo · ${u.dependencia ?? u.cargo ?? "—"}`;
    return "—";
};

export const AprobacionesTabla = ({ pendientes, procesando, onAprobar, onRechazar }) => (
    <div className={tableWrapper}>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className={tableHeadRow}>
                        {["Solicitante", "Perfil", "Roles", "Registro", "Acciones"].map((h) => (
                            <th key={h} className={tableHeadCell}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className={tableBody}>
                    {pendientes.map((u) => {
                        const uid = u.userId ?? u.id;
                        const busy = procesando === uid;
                        return (
                            <tr key={uid} className={tableRow}>
                                <td className="px-4 py-3">
                                    <p className={tableCellPrimary}>{nombreCompleto(u)}</p>
                                    <p className={tableCellSubtext}>{u.email}</p>
                                    <p className={tableCellSubtext}>{u.cedula ?? "—"}</p>
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted}`}>
                                    {perfilLabel(u)}
                                </td>
                                <td className="px-4 py-3">
                                    <RolesBadge roles={normalizarRoles(u.roles)} />
                                </td>
                                <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
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
                                                text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30
                                                hover:bg-green-100 dark:hover:bg-green-900/50 disabled:opacity-50 transition"
                                        >
                                            {busy ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                            Aprobar
                                        </button>
                                        <button
                                            onClick={() => onRechazar(u)}
                                            disabled={busy}
                                            title="Rechazar"
                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                                text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30
                                                hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50 transition"
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
