import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
    card,
    tableHeadRowReporte,
    tableHeadCellReporte,
    tableHeadCellReporteRight,
    focusRing,
} from "../../../components/ui/themeTokens";

const td = "px-3 py-2 text-sm text-gray-700 dark:text-gray-300";

export const ProduccionProgramasTabla = ({ filas, vacio, defaultAbierto = false }) => {
    const [abierto, setAbierto] = useState(defaultAbierto);

    return (
        <div className={`${card} overflow-hidden`}>
            <button
                type="button"
                onClick={() => setAbierto((v) => !v)}
                aria-expanded={abierto}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700
                    text-left hover:bg-gray-50/80 dark:hover:bg-gray-900/30 transition ${focusRing}`}
            >
                <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Producción por programa
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Indicadores por programa acreditable según vinculación del docente.
                    </p>
                </div>
                <ChevronDown
                    size={16}
                    className={`shrink-0 text-gray-400 transition-transform ${abierto ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>
            {abierto && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                        <thead>
                            <tr className={tableHeadRowReporte}>
                                <th className={tableHeadCellReporte}>Programa</th>
                                <th className={tableHeadCellReporte}>Facultad</th>
                                <th className={tableHeadCellReporte}>Código</th>
                                <th className={tableHeadCellReporteRight}>Productos</th>
                                <th className={tableHeadCellReporteRight}>Publicados</th>
                                <th className={tableHeadCellReporteRight}>Doc. con prod.</th>
                                <th className={tableHeadCellReporteRight}>Doc. total</th>
                                <th className={tableHeadCellReporteRight}>Cobertura</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {filas.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                                        {vacio}
                                    </td>
                                </tr>
                            ) : (
                                filas.map((p) => (
                                    <tr key={p.programaId} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30">
                                        <td className={`${td} font-medium text-gray-900 dark:text-white`}>{p.nombre}</td>
                                        <td className={td}>{p.facultadNombre}</td>
                                        <td className={td}>{p.codigo}</td>
                                        <td className={`${td} text-right tabular-nums`}>{p.total}</td>
                                        <td className={`${td} text-right tabular-nums`}>{p.publicados}</td>
                                        <td className={`${td} text-right tabular-nums`}>{p.docentesConProduccion}</td>
                                        <td className={`${td} text-right tabular-nums`}>{p.totalDocentes}</td>
                                        <td className={`${td} text-right tabular-nums font-medium`}>
                                            {p.porcentajeCobertura}%
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
