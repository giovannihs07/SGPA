import { Database, Eye, Pencil, Plus, Trash2, Layers, ToggleLeft, ToggleRight } from "lucide-react";
import {
    tableWrapper, tableHeadRow, tableHeadCell, tableBody, tableRow,
    tableCellPrimary, tableCellMuted,
    inputSm, selectSm, btnPrimary, btnGhost, btnText, label, text, card,
} from "../../../components/ui/themeTokens";

const TIPOS_DATO = ["TEXT", "NUMBER", "DATE", "BOOLEAN", "SELECT"];

const EstadoBadge = ({ activo }) => (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
        ${activo
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
        }`}>
        {activo ? "Activo" : "Inactivo"}
    </span>
);

const mensajeTooltipEliminar = (item) => {
    if (item.eliminable === true) {
        return "Eliminar permanentemente";
    }

    const bloqueos = [];
    if (item.activo) {
        bloqueos.push("debe estar desactivado");
    }
    const productos = Number(item.productosAsociados ?? 0);
    if (productos > 0) {
        bloqueos.push(
            `no debe tener productos asociados (${productos} registrado${productos !== 1 ? "s" : ""})`,
        );
    }

    if (!bloqueos.length) {
        return "No se puede eliminar";
    }

    return `No se puede eliminar: ${bloqueos.join("; ")}`;
};

const BotonEliminar = ({ item, onDelete }) => {
    const puedeEliminar = item.eliminable === true;
    const title = mensajeTooltipEliminar(item);

    return (
        <span title={title} className="inline-flex">
            <button
                type="button"
                onClick={() => puedeEliminar && onDelete(item)}
                disabled={!puedeEliminar}
                aria-label={title}
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition
                    ${!puedeEliminar
                        ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                        : "text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    }`}
            >
                <Trash2 size={14} />
            </button>
        </span>
    );
};

export const TaxonomiaSetupPanel = ({ onCargarPredeterminada, onModoManual, seeding }) => (
    <div className="space-y-4">
        <div className={`${card} p-6`}>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-50 mb-1">
                Configurar taxonomía de productos
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Aún no hay categorías de productos en el sistema. Elige cómo deseas comenzar:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={onCargarPredeterminada}
                    disabled={seeding}
                    className="text-left p-5 rounded-xl border-2 border-[#EC7A21]/30
                        bg-[#ffc20e]/5 hover:border-[#EC7A21] transition group"
                >
                    <Database size={24} className="text-[#EC7A21] mb-3" />
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-50 mb-1">
                        Cargar estructura predeterminada
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Crea automáticamente 2 categorías, 9 subcategorías y 80 tipos
                        con sus atributos (clasificación MinCiencias).
                    </p>
                    <p className="text-xs font-semibold text-[#EC7A21] mt-3">
                        {seeding ? "Cargando…" : "Recomendado →"}
                    </p>
                </button>

                <button
                    type="button"
                    onClick={onModoManual}
                    disabled={seeding}
                    className="text-left p-5 rounded-xl border-2 border-gray-200 dark:border-gray-700
                        hover:border-gray-400 dark:hover:border-gray-500 transition"
                >
                    <Layers size={24} className="text-gray-500 mb-3" />
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-50 mb-1">
                        Configurar manualmente
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        Crea categorías, subcategorías y tipos de producto uno a uno,
                        definiendo los atributos de cada tipo.
                    </p>
                    <p className="text-xs font-semibold text-gray-500 mt-3">Empezar vacío →</p>
                </button>
            </div>
        </div>
    </div>
);

export const TaxonomiaResumenPanel = ({ estado }) => (
    <div className="rounded-xl border border-[#EC7A21]/20 bg-[#ffc20e]/5 px-4 py-3
        flex flex-wrap gap-4 text-sm">
        <span className="font-semibold text-gray-800 dark:text-gray-100">Taxonomía activa</span>
        <span className={text.muted}>{estado?.categorias ?? 0} categorías</span>
        <span className={text.muted}>{estado?.subcategorias ?? 0} subcategorías</span>
        <span className={text.muted}>{estado?.tipos ?? 0} tipos de producto</span>
    </div>
);

const PASOS_MANUAL = [
    { id: "categorias",    label: "Categorías",     hint: "Ej.: Investigativo, Académico" },
    { id: "subcategorias", label: "Subcategorías",  hint: "Agrupa tipos dentro de cada categoría" },
    { id: "tipos",         label: "Tipos",          hint: "Define campos (atributos) del formulario docente" },
];

export const TaxonomiaManualGuia = ({ pasoActual, subTab, onIrAPaso }) => (
    <div className={`${card} p-4 space-y-3`}>
        <p className="text-xs font-bold uppercase tracking-widest text-[#EC7A21]">
            Configuración manual — paso {Math.min(pasoActual, 3)} de 3
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PASOS_MANUAL.map((paso, index) => {
                const num = index + 1;
                const completado = pasoActual > num;
                const activo = subTab === paso.id;
                return (
                    <button
                        key={paso.id}
                        type="button"
                        onClick={() => onIrAPaso(paso.id)}
                        className={`text-left p-3 rounded-lg border transition
                            ${activo
                                ? "border-[#EC7A21] bg-[#ffc20e]/10"
                                : completado
                                    ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
                                    : "border-gray-200 dark:border-gray-700"
                            }`}
                    >
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-100">
                            {completado ? "✓ " : `${num}. `}{paso.label}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{paso.hint}</p>
                    </button>
                );
            })}
        </div>
        {pasoActual >= 4 && (
            <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                Taxonomía básica configurada. Puedes seguir agregando tipos o editar lo existente.
            </p>
        )}
    </div>
);

export const TaxonomiaPendienteBanner = ({ onIrAProductos }) => (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20
        px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Taxonomía de productos pendiente
            </p>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                Los docentes necesitan categorías y tipos definidos antes de registrar producción académica.
            </p>
        </div>
        <button type="button" onClick={onIrAProductos} className={btnPrimary}>
            Configurar productos
        </button>
    </div>
);

export const CategoriasProductoPanel = ({
    categorias, formCat, setFormCat, editCatId, saving,
    onSubmit, onEdit, onCancel, onToggle, onDelete,
}) => (
    <div className="space-y-5">
        <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 rounded-xl border
            border-gray-100 dark:border-gray-700 p-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Plus size={16} className="text-[#EC7A21]" />
                {editCatId ? "Editar categoría" : "Crear categoría"}
            </h3>
            <div>
                <label className={label}>Nombre *</label>
                <input required className={inputSm} value={formCat.nombre}
                    onChange={(e) => setFormCat({ ...formCat, nombre: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end">
                {editCatId && <button type="button" onClick={onCancel} className={btnGhost}>Cancelar</button>}
                <button type="submit" disabled={saving} className={btnPrimary}>
                    {saving ? "Guardando…" : editCatId ? "Guardar cambios" : "Crear categoría"}
                </button>
            </div>
        </form>

        <div className={tableWrapper}>
            {categorias.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
                    Sin categorías. Crea la primera para continuar.
                </p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                        <tr className={tableHeadRow}>
                            {["Nombre", "Estado", "Acciones"].map((h) => (
                                <th key={h} className={tableHeadCell}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {categorias.map((cat) => (
                            <tr key={cat.id} className={tableRow}>
                                <td className={`px-4 py-3 ${tableCellPrimary}`}>{cat.nombre}</td>
                                <td className="px-4 py-3"><EstadoBadge activo={cat.activo} /></td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <button type="button" onClick={() => onEdit(cat)} title="Editar"
                                            className="w-7 h-7 flex items-center justify-center rounded-lg
                                                text-gray-400 hover:text-[#EC7A21]">
                                            <Pencil size={14} />
                                        </button>
                                        <button type="button" onClick={() => onToggle(cat)}
                                            title={cat.activo ? "Desactivar" : "Activar"}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg
                                                text-gray-400 hover:text-[#EC7A21]">
                                            {cat.activo ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                        </button>
                                        <BotonEliminar item={cat} onDelete={onDelete} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
);

export const SubcategoriasProductoPanel = ({
    categorias, categoriaSel, setCategoriaSel,
    subcategorias, formSub, setFormSub, editSubId, saving,
    onSubmit, onEdit, onCancel, onToggle, onDelete,
}) => (
    <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
            <label className={`text-xs font-semibold ${text.muted}`}>Categoría:</label>
            <select value={categoriaSel} onChange={(e) => setCategoriaSel(e.target.value)}
                className={`${selectSm} max-w-md`}>
                <option value="">Seleccionar…</option>
                {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
            </select>
        </div>

        {categoriaSel && (
            <>
                <form onSubmit={onSubmit} className="bg-white dark:bg-gray-800 rounded-xl border
                    border-gray-100 dark:border-gray-700 p-5 space-y-3">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Plus size={16} className="text-[#EC7A21]" />
                        {editSubId ? "Editar subcategoría" : "Crear subcategoría"}
                    </h3>
                    <div>
                        <label className={label}>Nombre *</label>
                        <input required className={inputSm} value={formSub.nombre}
                            onChange={(e) => setFormSub({ ...formSub, nombre: e.target.value })} />
                    </div>
                    <div className="flex gap-2 justify-end">
                        {editSubId && <button type="button" onClick={onCancel} className={btnGhost}>Cancelar</button>}
                        <button type="submit" disabled={saving} className={btnPrimary}>
                            {saving ? "Guardando…" : editSubId ? "Guardar" : "Crear subcategoría"}
                        </button>
                    </div>
                </form>

                <div className={tableWrapper}>
                    {subcategorias.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
                            Sin subcategorías en esta categoría.
                        </p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={tableHeadRow}>
                                    {["Nombre", "Estado", "Acciones"].map((h) => (
                                        <th key={h} className={tableHeadCell}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={tableBody}>
                                {subcategorias.map((sub) => (
                                    <tr key={sub.id} className={tableRow}>
                                        <td className={`px-4 py-3 ${tableCellPrimary}`}>{sub.nombre}</td>
                                        <td className="px-4 py-3"><EstadoBadge activo={sub.activo} /></td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button type="button" onClick={() => onEdit(sub)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg
                                                        text-gray-400 hover:text-[#EC7A21]">
                                                    <Pencil size={14} />
                                                </button>
                                                <button type="button" onClick={() => onToggle(sub)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg
                                                        text-gray-400 hover:text-[#EC7A21]">
                                                    {sub.activo ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                                </button>
                                                <BotonEliminar item={sub} onDelete={onDelete} />
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

export const TiposProductoPanel = ({
    categorias, categoriaSel, setCategoriaSel,
    subcategorias, subcategoriaSel, setSubcategoriaSel,
    tipos, formTipo, setFormTipo, editTipoId, saving, loadingDetalle,
    onSubmit, onEdit, onVerDetalle, onCancel, onToggle, onDelete,
    onAgregarAtributo, onQuitarAtributo, onActualizarAtributo,
}) => (
    <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
            <select value={categoriaSel} onChange={(e) => setCategoriaSel(e.target.value)}
                className={`${selectSm} max-w-xs`}>
                <option value="">Categoría…</option>
                {categorias.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
            </select>
            <select value={subcategoriaSel} onChange={(e) => setSubcategoriaSel(e.target.value)}
                disabled={!categoriaSel}
                className={`${selectSm} max-w-md`}>
                <option value="">Subcategoría…</option>
                {subcategorias.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
            </select>
        </div>

        {subcategoriaSel && (
            <>
                <form id="form-tipo-producto" onSubmit={onSubmit} className="bg-white dark:bg-gray-800 rounded-xl border
                    border-gray-100 dark:border-gray-700 p-5 space-y-4">
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Plus size={16} className="text-[#EC7A21]" />
                        {editTipoId ? "Editar tipo de producto" : "Crear tipo de producto"}
                    </h3>

                    <div>
                        <label className={label}>Nombre del tipo *</label>
                        <input required className={inputSm} value={formTipo.nombre}
                            onChange={(e) => setFormTipo({ ...formTipo, nombre: e.target.value })} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className={label}>Atributos del formulario *</label>
                            <button type="button" onClick={onAgregarAtributo} className={btnText}>
                                + Agregar atributo
                            </button>
                        </div>

                        {formTipo.atributos.map((attr, index) => (
                            <div key={index}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 p-3
                                    rounded-lg border border-gray-100 dark:border-gray-700">
                                <div>
                                    <label className={label}>Clave interna</label>
                                    <input required className={inputSm} value={attr.nombreAtributo}
                                        placeholder="doi, isbn…"
                                        onChange={(e) => onActualizarAtributo(index, "nombreAtributo", e.target.value)} />
                                </div>
                                <div>
                                    <label className={label}>Etiqueta</label>
                                    <input required className={inputSm} value={attr.etiqueta}
                                        onChange={(e) => onActualizarAtributo(index, "etiqueta", e.target.value)} />
                                </div>
                                <div>
                                    <label className={label}>Tipo de dato</label>
                                    <select className={selectSm} value={attr.tipoDato}
                                        onChange={(e) => onActualizarAtributo(index, "tipoDato", e.target.value)}>
                                        {TIPOS_DATO.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col justify-end pb-1">
                                    <label className={`${label} flex items-center gap-2 cursor-pointer`}>
                                        <input
                                            type="checkbox"
                                            checked={attr.requerido !== false}
                                            onChange={(e) => onActualizarAtributo(index, "requerido", e.target.checked)}
                                            className="rounded border-gray-300 text-[#EC7A21] focus:ring-[#EFB357]"
                                        />
                                        Requerido
                                    </label>
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                                        {attr.requerido !== false ? "Obligatorio en el formulario docente" : "Opcional"}
                                    </span>
                                </div>
                                <div className="flex items-end gap-2">
                                    {attr.tipoDato === "SELECT" && (
                                        <div className="flex-1">
                                            <label className={label}>Opciones</label>
                                            <input className={inputSm} value={attr.opciones}
                                                placeholder="A1,A2,B,C"
                                                onChange={(e) => onActualizarAtributo(index, "opciones", e.target.value)} />
                                        </div>
                                    )}
                                    {formTipo.atributos.length > 1 && (
                                        <button type="button" onClick={() => onQuitarAtributo(index)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg
                                                text-gray-400 hover:text-red-600 shrink-0">
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 justify-end">
                        {editTipoId && <button type="button" onClick={onCancel} className={btnGhost}>Cancelar</button>}
                        <button type="submit" disabled={saving} className={btnPrimary}>
                            {saving ? "Guardando…" : editTipoId ? "Guardar cambios" : "Crear tipo"}
                        </button>
                    </div>
                </form>

                <div className={tableWrapper}>
                    {tipos.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-10">
                            Sin tipos en esta subcategoría.
                        </p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={tableHeadRow}>
                                    {["Tipo", "Atributos", "Estado", "Acciones"].map((h) => (
                                        <th key={h} className={tableHeadCell}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={tableBody}>
                                {tipos.map((tipo) => (
                                    <tr key={tipo.id} className={tableRow}>
                                        <td className={`px-4 py-3 ${tableCellPrimary}`}>{tipo.nombre}</td>
                                        <td className={`px-4 py-3 ${tableCellMuted}`}>
                                            {tipo.atributos?.length
                                                ? `${tipo.atributos.filter((a) => a.requerido !== false).length}/${tipo.atributos.length} oblig.`
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3"><EstadoBadge activo={tipo.activo} /></td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => onVerDetalle(tipo)}
                                                    disabled={loadingDetalle}
                                                    title="Ver detalles"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg
                                                        text-gray-400 hover:text-[#EC7A21]
                                                        disabled:opacity-40 disabled:cursor-not-allowed"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                <button type="button" onClick={() => onEdit(tipo)}
                                                    title="Editar"
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg
                                                        text-gray-400 hover:text-[#EC7A21]">
                                                    <Pencil size={14} />
                                                </button>
                                                <button type="button" onClick={() => onToggle(tipo)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg
                                                        text-gray-400 hover:text-[#EC7A21]">
                                                    {tipo.activo ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                                </button>
                                                <BotonEliminar item={tipo} onDelete={onDelete} />
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
