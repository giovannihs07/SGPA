import { useEffect } from "react";
import { X } from "lucide-react";
import {
    formatFechaHora, labelModulo, labelAccion, labelResultado, parseDetalles,
} from "../auditoriaHelpers";
import { ResultadoBadge, ModuloBadge } from "./AuditoriaBadges";

const DetalleItem = ({ label, children }) => (
    <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
        <div className="text-sm text-gray-700 dark:text-gray-300">{children}</div>
    </div>
);

export const AuditoriaDetalleModal = ({ log, onClose }) => {
    useEffect(() => {
        if (!log) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [log, onClose]);

    if (!log) return null;

    const detalles = parseDetalles(log.detalles);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <button type="button" className="absolute inset-0 bg-black/50" onClick={onClose} aria-label="Cerrar" />
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#EC7A21] mb-1">
                            Evento #{log.id}
                        </p>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {labelAccion(log.accion)}
                        </h2>
                    </div>
                    <button type="button" onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{log.descripcion}</p>

                    <div className="grid grid-cols-2 gap-4">
                        <DetalleItem label="Fecha">{formatFechaHora(log.fechaCreacion)}</DetalleItem>
                        <DetalleItem label="Usuario">{log.actorEmail}</DetalleItem>
                        <DetalleItem label="Módulo">
                            <ModuloBadge label={labelModulo(log.modulo)} />
                        </DetalleItem>
                        <DetalleItem label="Resultado">
                            <ResultadoBadge resultado={log.resultado} label={labelResultado(log.resultado)} />
                        </DetalleItem>
                        {log.entidadLabel && (
                            <DetalleItem label="Entidad afectada">{log.entidadLabel}</DetalleItem>
                        )}
                        {log.ipAddress && (
                            <DetalleItem label="IP">{log.ipAddress}</DetalleItem>
                        )}
                    </div>

                    {detalles && (
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                                Detalles adicionales
                            </p>
                            <pre className="text-xs bg-gray-50 dark:bg-gray-900/50 border border-gray-200
                                dark:border-gray-700 rounded-lg p-3 overflow-x-auto text-gray-700 dark:text-gray-300">
                                {typeof detalles === "string"
                                    ? detalles
                                    : JSON.stringify(detalles, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
