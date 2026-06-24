import { useEffect } from "react";
import { X, Pencil, Layers } from "lucide-react";
import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellMuted, btnPrimary,
} from "../../../components/ui/themeTokens";

const EstadoBadge = ({ activo }) => (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
        ${activo
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
        }`}>
        {activo ? "Activo" : "Inactivo"}
    </span>
);

const DetallePill = ({ label, value, accent = "border-[#EC7A21]" }) => (
    <div className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
        rounded-xl px-3 py-2.5 border-l-[3px] ${accent}`}>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
            {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">
            {value || "—"}
        </p>
    </div>
);

const DetalleMeta = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">
            {label}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{value ?? "—"}</p>
    </div>
);

export const TipoProductoDetalleModal = ({ tipo, onClose, onEditar }) => {
    useEffect(() => {
        if (!tipo) return;

        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [tipo, onClose]);

    if (!tipo) return null;

    const atributos = [...(tipo.atributos ?? [])].sort(
        (a, b) => (a.orden ?? 0) - (b.orden ?? 0),
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-tipo-titulo"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
                onClick={onClose}
                aria-label="Cerrar"
            />

            <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col
                bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">

                <div className="shrink-0 px-6 py-5 border-b border-gray-100 dark:border-gray-700
                    bg-linear-to-br from-[#ffc20e]/10 to-[#EC7A21]/10">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 pr-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#EC7A21] mb-1">
                                Tipo de producto · #{tipo.id}
                            </p>
                            <h2
                                id="detalle-tipo-titulo"
                                className="text-lg font-extrabold text-gray-900 dark:text-gray-100 leading-snug"
                            >
                                {tipo.nombre}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <EstadoBadge activo={tipo.activo} />
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-lg
                                    text-gray-400 hover:bg-white/60 hover:text-gray-600 transition"
                                aria-label="Cerrar"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                    {!tipo.activo && (
                        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20
                            border border-amber-200 dark:border-amber-800">
                            <p className="text-xs text-amber-800 dark:text-amber-300">
                                Este tipo está inactivo. Los docentes no pueden registrar productos
                                nuevos con él.
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
                            Clasificación
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <DetallePill
                                label="Categoría"
                                value={tipo.categoriaNombre}
                            />
                            <DetallePill
                                label="Subcategoría"
                                value={tipo.subcategoriaNombre}
                                accent="border-[#EFB357]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                            <DetalleMeta
                                label="Productos registrados"
                                value={tipo.productosAsociados ?? 0}
                            />
                        </div>
                        <div className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3">
                            <DetalleMeta
                                label="Eliminable"
                                value={tipo.eliminable === false ? "No (hay productos asociados)" : "Sí"}
                            />
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5
                            flex items-center gap-1.5">
                            <Layers size={12} />
                            Atributos del formulario docente ({atributos.length})
                        </p>

                        {atributos.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6
                                border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                                Sin atributos definidos.
                            </p>
                        ) : (
                            <div className={tableWrapper}>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={tableHeadRow}>
                                            {["#", "Clave", "Etiqueta", "Tipo", "Req.", "Opciones"].map((h) => (
                                                <th key={h} className={tableHeadCell}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className={tableBody}>
                                        {atributos.map((attr, index) => (
                                            <tr key={attr.id ?? `${attr.nombreAtributo}-${index}`} className={tableRow}>
                                                <td className={`px-4 py-2.5 ${tableCellMuted}`}>
                                                    {attr.orden ?? index + 1}
                                                </td>
                                                <td className={`px-4 py-2.5 ${tableCellMuted} font-mono text-xs`}>
                                                    {attr.nombreAtributo}
                                                </td>
                                                <td className={`px-4 py-2.5 ${tableCellPrimary}`}>
                                                    {attr.etiqueta}
                                                </td>
                                                <td className={`px-4 py-2.5 ${tableCellMuted}`}>
                                                    {attr.tipoDato}
                                                </td>
                                                <td className="px-4 py-2.5">
                                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded
                                                        ${attr.requerido !== false
                                                            ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                                        }`}>
                                                        {attr.requerido !== false ? "Sí" : "No"}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-2.5 ${tableCellMuted} text-xs`}>
                                                    {attr.tipoDato === "SELECT" && attr.opciones
                                                        ? attr.opciones
                                                        : "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="shrink-0 flex flex-wrap items-center justify-end gap-2
                    px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        Cerrar
                    </button>
                    <button
                        type="button"
                        onClick={onEditar}
                        className={`${btnPrimary} inline-flex items-center gap-1.5`}
                    >
                        <Pencil size={14} /> Editar tipo
                    </button>
                </div>
            </div>
        </div>
    );
};
