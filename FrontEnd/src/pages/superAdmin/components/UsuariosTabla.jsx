import { Shield, UserX, UserCheck, Ban } from "lucide-react";
import { EstadoUsuarioBadge } from "./EstadoUsuarioBadge";
import { RolesBadge } from "./RolesBadge";
import { nombreCompleto, normalizarRoles } from "../superAdminHelpers";

// Tabla de usuarios con los usuarios filtrados por el estado y la búsqueda
export const UsuariosTabla = ({
    usuarios, onActivar, onDesactivar, onRechazar, onCambiarRoles,
}) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700 bg-linear-to-r from-[#ffc20e]/5 to-transparent">
                        {["Usuario", "Cédula", "Estado", "Roles", "Acciones"].map((h) => (
                            <th key={h}
                                className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                    {usuarios.map((u) => (
                        <tr key={u.id} className="hover:bg-[#ffc20e]/5 transition">
                            <td className="px-4 py-3">
                                <p className="font-medium text-gray-800 dark:text-gray-100 text-xs">
                                    {nombreCompleto(u)}
                                </p>
                                <p className="text-[11px] text-gray-400">{u.email}</p>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                {u.cedula ?? "—"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <EstadoUsuarioBadge estado={u.estado} />
                            </td>
                            <td className="px-4 py-3">
                                <RolesBadge roles={normalizarRoles(u.roles)} />
                            </td>
                            <td className="px-4 py-3">
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
                                            title={u.estado === "PENDIENTE" ? "Aprobar registro" : "Activar"}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-green-600 hover:bg-green-50 transition"
                                        >
                                            <UserCheck size={14} />
                                        </button>
                                    )}
                                    {/* Botón para rechazar el usuario */}
                                    {u.estado === "PENDIENTE" && onRechazar && (
                                        <button
                                            onClick={() => onRechazar(u)}
                                            title="Rechazar registro"
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition"
                                        >
                                            <Ban size={14} />
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
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
