import { Building2, Pencil, Trash2, Plus } from "lucide-react";
import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellMuted,
    inputSm, selectSm, btnPrimary, btnGhost, label, text,
} from "../../../components/ui/themeTokens";

export const InstitucionPanel = ({
    instituciones, formInst, setFormInst, editInstId, saving,
    onSubmit, onEdit, onCancel, onDelete,
}) => (
    <div className="space-y-5">
        <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 rounded-xl border
            border-gray-100 dark:border-gray-700 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Building2 size={16} className="text-[#EC7A21]" />
                {editInstId ? "Editar institución" : "Crear institución"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className={label}>Nombre *</label>
                    <input required className={inputSm} value={formInst.nombre}
                        onChange={(e) => setFormInst({ ...formInst, nombre: e.target.value })} />
                </div>
                <div>
                    <label className={label}>NIT *</label>
                    <input required className={inputSm} value={formInst.nit}
                        onChange={(e) => setFormInst({ ...formInst, nit: e.target.value })} />
                </div>
                <div>
                    <label className={label}>Ciudad *</label>
                    <input required className={inputSm} value={formInst.ciudad}
                        onChange={(e) => setFormInst({ ...formInst, ciudad: e.target.value })} />
                </div>
                <div>
                    <label className={label}>País *</label>
                    <input required className={inputSm} value={formInst.pais}
                        onChange={(e) => setFormInst({ ...formInst, pais: e.target.value })} />
                </div>
            </div>
            <div className="flex gap-2 justify-end">
                {editInstId && (
                    <button type="button" onClick={onCancel} className={btnGhost}>Cancelar</button>
                )}
                <button type="submit" disabled={saving} className={btnPrimary}>
                    {saving ? "Guardando…" : editInstId ? "Guardar cambios" : "Crear institución"}
                </button>
            </div>
        </form>

        {instituciones.length > 0 && (
            <div className={tableWrapper}>
                <table className="w-full text-sm">
                    <thead>
                        <tr className={tableHeadRow}>
                            {["Nombre", "NIT", "Ciudad", "País", "Acciones"].map((h) => (
                                <th key={h} className={tableHeadCell}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {instituciones.map((inst) => (
                            <tr key={inst.id} className={tableRow}>
                                <td className={`px-4 py-3 ${tableCellPrimary}`}>{inst.nombre}</td>
                                <td className={`px-4 py-3 ${tableCellMuted}`}>{inst.nit}</td>
                                <td className={`px-4 py-3 ${tableCellMuted}`}>{inst.ciudad}</td>
                                <td className={`px-4 py-3 ${tableCellMuted}`}>{inst.pais}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <button onClick={() => onEdit(inst)} title="Editar"
                                            className="w-7 h-7 flex items-center justify-center rounded-lg
                                                text-gray-400 hover:text-[#EC7A21] hover:bg-orange-50">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => onDelete(inst)} title="Eliminar"
                                            className="w-7 h-7 flex items-center justify-center rounded-lg
                                                text-gray-400 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
);

export const FacultadesPanel = ({
    instituciones, institucionSel, setInstitucionSel,
    facultades, formFac, setFormFac, editFacId, saving,
    onSubmit, onEdit, onCancel, onDelete,
}) => (
    <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
            <label className={`text-xs font-semibold ${text.muted}`}>Institución:</label>
            <select value={institucionSel} onChange={(e) => setInstitucionSel(e.target.value)}
                className={`${selectSm} max-w-xs`}>
                <option value="">Seleccionar…</option>
                {instituciones.map((i) => (
                    <option key={i.id} value={i.id}>{i.nombre}</option>
                ))}
            </select>
        </div>

        {institucionSel && (
            <>
                <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 rounded-xl border
                    border-gray-100 dark:border-gray-700 p-5 space-y-3">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Plus size={16} className="text-[#EC7A21]" />
                        {editFacId ? "Editar facultad" : "Agregar facultad"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className={label}>Nombre *</label>
                            <input required className={inputSm} value={formFac.nombre}
                                onChange={(e) => setFormFac({ ...formFac, nombre: e.target.value })} />
                        </div>
                        <div>
                            <label className={label}>Código *</label>
                            <input required className={inputSm} value={formFac.codigo ?? ""}
                                onChange={(e) => setFormFac({ ...formFac, codigo: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        {editFacId && <button type="button" onClick={onCancel} className={btnGhost}>Cancelar</button>}
                        <button type="submit" disabled={saving} className={btnPrimary}>
                            {saving ? "Guardando…" : editFacId ? "Guardar" : "Agregar"}
                        </button>
                    </div>
                </form>

                <div className={tableWrapper}>
                    {facultades.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">Sin facultades registradas</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={tableHeadRow}>
                                    {["Nombre", "Código", "Acciones"].map((h) => (
                                        <th key={h} className={tableHeadCell}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={tableBody}>
                                {facultades.map((f) => (
                                    <tr key={f.id} className={tableRow}>
                                        <td className={`px-4 py-3 ${tableCellPrimary}`}>{f.nombre}</td>
                                        <td className={`px-4 py-3 ${tableCellMuted}`}>{f.codigo ?? "—"}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button onClick={() => onEdit(f)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg
                                                        text-gray-400 hover:text-[#EC7A21]">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => onDelete(f)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg
                                                        text-gray-400 hover:text-red-600">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </>
        )}
    </div>
);

export const ProgramasPanel = ({
    facultades, facultadSel, setFacultadSel, niveles,
    programas, formProg, setFormProg, editProgId, saving,
    onSubmit, onEdit, onCancel, onDelete, NIVEL_LABELS,
}) => (
    <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
            <label className={`text-xs font-semibold ${text.muted}`}>Facultad:</label>
            <select value={facultadSel} onChange={(e) => setFacultadSel(e.target.value)}
                className={`${selectSm} max-w-xs`}>
                <option value="">Seleccionar…</option>
                {facultades.map((f) => (
                    <option key={f.id} value={f.id}>{f.nombre}</option>
                ))}
            </select>
        </div>

        {facultadSel && (
            <>
                <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 rounded-xl border
                    border-gray-100 dark:border-gray-700 p-5 space-y-3">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Plus size={16} className="text-[#EC7A21]" />
                        {editProgId ? "Editar programa" : "Agregar programa"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                            <label className={label}>Nombre *</label>
                            <input required className={inputSm} value={formProg.nombre}
                                onChange={(e) => setFormProg({ ...formProg, nombre: e.target.value })} />
                        </div>
                        <div>
                            <label className={label}>Código SNIES *</label>
                            <input required className={inputSm} value={formProg.codigo ?? ""}
                                onChange={(e) => setFormProg({ ...formProg, codigo: e.target.value })} />
                        </div>
                        <div>
                            <label className={label}>Nivel *</label>
                            <select required className={selectSm} value={formProg.nivel}
                                onChange={(e) => setFormProg({ ...formProg, nivel: e.target.value })}>
                                <option value="">Seleccionar…</option>
                                {niveles.map((n) => (
                                    <option key={n} value={n}>{NIVEL_LABELS[n] ?? n}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        {editProgId && <button type="button" onClick={onCancel} className={btnGhost}>Cancelar</button>}
                        <button type="submit" disabled={saving} className={btnPrimary}>
                            {saving ? "Guardando…" : editProgId ? "Guardar" : "Agregar"}
                        </button>
                    </div>
                </form>

                <div className={tableWrapper}>
                    {programas.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">Sin programas registrados</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={tableHeadRow}>
                                    {["Nombre", "Código SNIES", "Nivel", "Acciones"].map((h) => (
                                        <th key={h} className={tableHeadCell}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={tableBody}>
                                {programas.map((p) => (
                                    <tr key={p.id} className={tableRow}>
                                        <td className={`px-4 py-3 ${tableCellPrimary}`}>{p.nombre}</td>
                                        <td className={`px-4 py-3 ${tableCellMuted}`}>{p.codigo ?? "—"}</td>
                                        <td className={`px-4 py-3 ${tableCellMuted}`}>
                                            {NIVEL_LABELS[p.nivel] ?? p.nivel}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button onClick={() => onEdit(p)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg
                                                        text-gray-400 hover:text-[#EC7A21]">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => onDelete(p)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg
                                                        text-gray-400 hover:text-red-600">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </>
        )}
    </div>
);
