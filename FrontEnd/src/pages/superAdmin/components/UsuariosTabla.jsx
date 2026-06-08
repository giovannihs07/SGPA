import { Shield, UserX, UserCheck } from "lucide-react";
import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellMuted, tableCellSubtext,
} from "../../../components/ui/themeTokens";
import { EstadoUsuarioBadge } from "./EstadoUsuarioBadge";
import { RolesBadge } from "./RolesBadge";
import { nombreCompleto, normalizarRoles } from "../superAdminHelpers";
import { esUsuarioSuperAdmin } from "../../admin/adminHelpers";

// Tabla de usuarios con los usuarios filtrados por el estado y la búsqueda
export const UsuariosTabla = ({
    usuarios, onActivar, onDesactivar, onCambiarRoles,
    bloquearSuperAdmin = false,
}) => (
    <div className={tableWrapper}>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className={tableHeadRow}>
                        {["Usuario", "Cédula", "Estado", "Roles", "Acciones"].map((h) => (
                            <th key={h} className={tableHeadCell}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className={tableBody}>
                    {usuarios.map((u) => {
                        const protegido = bloquearSuperAdmin && esUsuarioSuperAdmin(u);
                        return (
                        <tr key={u.id} className={tableRow}>
                            <td className="px-4 py-3">
                                <p className={tableCellPrimary}>{nombreCompleto(u)}</p>
                                <p className={tableCellSubtext}>{u.email}</p>
                            </td>
                            <td className={`px-4 py-3 ${tableCellMuted} whitespace-nowrap`}>
                                {u.cedula ?? "—"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <EstadoUsuarioBadge estado={u.estado} />
                            </td>
                            <td className="px-4 py-3">
                                <RolesBadge roles={normalizarRoles(u.roles)} />
                            </td>
                            <td className="px-4 py-3">
                                {protegido ? (
                                    <span className="text-xs text-gray-400 italic">Protegido</span>
                                ) : (
                                <div className="flex items-center gap-1">
                                    {/* Botón para cambiar los roles del usuario */}
                                    <button
                                        onClick={() => onCambiarRoles(u)}
                                        title="Cambiar roles"
                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#ffc20e]/15 hover:text-[#EC7A21] transition"
                                    >
                                        <Shield size={14} />
                                    </button>
                                    {/* Botón para activar el usuario */}
                                    {u.estado !== "ACTIVO" && (
                                        <button
                                            onClick={() => onActivar(u)}
                                            title="Activar"
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-green-600 hover:bg-green-50 transition"
                                        >
                                            <UserCheck size={14} />
                                        </button>
                                    )}
                                    {u.estado === "ACTIVO" && (
                                        <button
                                            onClick={() => onDesactivar(u)}
                                            title="Desactivar"
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition"
                                        >
                                            <UserX size={14} />
                                        </button>
                                    )}
                                </div>
                                )}
                            </td>
                        </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);
