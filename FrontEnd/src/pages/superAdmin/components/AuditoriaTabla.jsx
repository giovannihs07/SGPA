import { Eye } from "lucide-react";
import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellSecondary, tableCellMuted, tableCellSubtext, btnIcon,
} from "../../../components/ui/themeTokens";
import {
    formatFechaHora, labelModulo, labelAccion, labelResultado,
} from "../auditoriaHelpers";
import { ResultadoBadge, ModuloBadge } from "./AuditoriaBadges";

export const AuditoriaTabla = ({ logs, onVerDetalle }) => (
    <div className={tableWrapper}>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className={tableHeadRow}>
                        {["Fecha / Hora", "Usuario", "Módulo", "Acción", "Estado", ""].map((h) => (
                            <th key={h || "acciones"} className={tableHeadCell}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className={tableBody}>
                    {logs.map((log) => (
                        <tr key={log.id} className={`${tableRow} group`}>
                            <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap text-xs`}>
                                {formatFechaHora(log.fechaCreacion)}
                            </td>
                            <td className="px-4 py-3 max-w-45">
                                <p className={`${tableCellPrimary} truncate`}>
                                    {log.actorEmail}
                                </p>
                                {log.entidadLabel && (
                                    <p className={`${tableCellSubtext} truncate`}>
                                        {log.entidadLabel}
                                    </p>
                                )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <ModuloBadge label={labelModulo(log.modulo)} />
                            </td>
                            <td className={`px-4 py-3 ${tableCellSecondary} max-w-50`}>
                                <span className="line-clamp-2">{labelAccion(log.accion)}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <ResultadoBadge
                                    resultado={log.resultado}
                                    label={labelResultado(log.resultado)}
                                />
                            </td>
                            <td className="px-4 py-3">
                                <button
                                    onClick={() => onVerDetalle(log)}
                                    title="Ver detalle"
                                    className={`${btnIcon} w-7 h-7 opacity-60 group-hover:opacity-100
                                        text-gray-500 hover:bg-[#ffc20e]/15 hover:text-[#EC7A21]`}
                                >
                                    <Eye size={14} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
