import { useRef } from "react";
import {
    CheckCircle, AlertCircle, Upload, X, ChevronDown,
    FileText, Tag, Layers, FlaskConical, BookOpen,
} from "lucide-react";
import { useRegistrarProducto } from "../../hooks/useRegistrarProducto";
import {
    CATEGORIA_LABELS,
    SUBCATEGORIA_LABELS,
    TIPO_LABELS,
    ATRIBUTO_LABELS,
    ATRIBUTOS_FECHA,
    ATRIBUTOS_NUMERO,
} from "./productoConfig";

// Componentes de UI internos

const Label = ({ children, required }) => (
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
        {children}
        {required && <span className="text-[#EC7A21] ml-0.5">*</span>}
    </label>
);
 
const inputBase =
    "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 " +
    "placeholder-gray-300 dark:placeholder-gray-600 " +
    "focus:outline-none focus:ring-2 focus:ring-[#EFB357]/50 focus:border-[#EFB357] " +
    "transition disabled:opacity-40 disabled:cursor-not-allowed";
 
const SelectField = ({ name, value, onChange, disabled, placeholder, children }) => (
    <div className="relative">
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${inputBase} appearance-none pr-9 ${disabled ? "bg-gray-50 dark:bg-gray-900" : ""}`}
        >
            <option value="" disabled>{placeholder}</option>
            {children}
        </select>
        <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
    </div>
);
 
const SectionCard = ({ icon: Icon, title, accent, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 ${accent}`}>
            <Icon size={15} className="shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        </div>
        <div className="p-5 space-y-4">{children}</div>
    </div>
);
 
const getInputType = (attr) => {
    if (ATRIBUTOS_FECHA.has(attr))  return "date";
    if (ATRIBUTOS_NUMERO.has(attr)) return "number";
    return "text";
};
 
// Página de registro de producto para docentes
 
export const RegistrarProductoPage = () => {
    const fileInputRef = useRef(null);
 
    const {
        loadingTipos, errorTipos,
        subcategoriasDisponibles, tiposDisponibles, atributosRequeridos,
        form, archivo, loading, success, error, isValid,
        handleChange, handleAtributoChange,
        handleArchivoChange, removeArchivo,
        handleSubmit, resetSuccess, resetError,
    } = useRegistrarProducto();
 
    // Estados de carga / error de la taxonomía (categorías, subcategorías, tipos y atributos)
    if (loadingTipos) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3 text-gray-400">
                    <div className="w-8 h-8 border-2 border-[#EFB357] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm">Cargando tipos de producto…</span>
                </div>
            </div>
        );
    }
 
    if (errorTipos) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg text-sm">
                    <AlertCircle size={16} />
                    {errorTipos}
                </div>
            </div>
        );
    }
 
    return (
        <div className="max-w-3xl mx-auto">
 
            {/* Banner de éxito */}
            {success && (
                <div className="flex items-center gap-3 mb-5 px-4 py-3.5 rounded-xl
                    bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800
                    text-green-700 dark:text-green-400">
                    <CheckCircle size={18} className="shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold">¡Producto registrado con éxito!</p>
                        <p className="text-xs mt-0.5 opacity-75">
                            Quedó en estado <strong>Sin publicar</strong>, pendiente de revisión.
                        </p>
                    </div>
                    <button onClick={resetSuccess} className="text-green-500 hover:text-green-700 transition">
                        <X size={16} />
                    </button>
                </div>
            )}
 
            {/* Banner de error */}
            {error && (
                <div className="flex items-center gap-3 mb-5 px-4 py-3.5 rounded-xl
                    bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                    text-red-700 dark:text-red-400">
                    <AlertCircle size={18} className="shrink-0" />
                    <p className="text-sm flex-1">{error}</p>
                    <button onClick={resetError} className="text-red-400 hover:text-red-600 transition">
                        <X size={16} />
                    </button>
                </div>
            )}
 
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
 
                {/* 1. Información general */}
                <SectionCard
                    icon={FileText}
                    title="Información general"
                    accent="text-[#EC7A21] bg-orange-50 dark:bg-orange-900/10"
                >
                    <div>
                        <Label required>Nombre del producto</Label>
                        <input
                            type="text"
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            placeholder="Título o nombre del producto académico"
                            className={inputBase}
                        />
                    </div>
                    <div>
                        <Label required>Descripción</Label>
                        <textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Describe brevemente el producto, su alcance y relevancia…"
                            className={`${inputBase} resize-none`}
                        />
                    </div>
                </SectionCard>
 
                {/* 2. Clasificación en cascada */}
                <SectionCard
                    icon={Tag}
                    title="Clasificación del producto"
                    accent="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10"
                >
                    {/* Categoría — botones radio */}
                    <div>
                        <Label required>Categoría</Label>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.entries(CATEGORIA_LABELS).map(([key, label]) => {
                                const active = form.categoria === key;
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() =>
                                            handleChange({ target: { name: "categoria", value: key } })
                                        }
                                        className={`
                                            flex items-center gap-2.5 px-4 py-3 rounded-lg border-2
                                            text-sm font-medium transition text-left
                                            ${active
                                                ? "border-[#EFB357] bg-amber-50 dark:bg-amber-900/20 text-gray-800 dark:text-white"
                                                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300 dark:hover:border-gray-600"
                                            }
                                        `}
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition
                                            ${active ? "border-[#EFB357]" : "border-gray-300"}`}>
                                            {active && <div className="w-2 h-2 rounded-full bg-[#EFB357]" />}
                                        </div>
                                        {key === "INVESTIGATIVO"
                                            ? <FlaskConical size={14} className="shrink-0" />
                                            : <BookOpen size={14} className="shrink-0" />
                                        }
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
 
                    {/* Subcategoría */}
                    <div>
                        <Label required>Subcategoría</Label>
                        <SelectField
                            name="subcategoria"
                            value={form.subcategoria}
                            onChange={handleChange}
                            disabled={!form.categoria}
                            placeholder={form.categoria ? "Selecciona una subcategoría" : "— elige categoría primero —"}
                        >
                            {subcategoriasDisponibles.map((sub) => (
                                <option key={sub} value={sub}>
                                    {SUBCATEGORIA_LABELS[sub] ?? sub}
                                </option>
                            ))}
                        </SelectField>
                    </div>
 
                    {/* Tipo */}
                    <div>
                        <Label required>Tipo de producto</Label>
                        <SelectField
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                            disabled={!form.subcategoria}
                            placeholder={form.subcategoria ? "Selecciona el tipo" : "— elige subcategoría primero —"}
                        >
                            {tiposDisponibles.map((t) => (
                                <option key={t} value={t}>
                                    {TIPO_LABELS[t] ?? t}
                                </option>
                            ))}
                        </SelectField>
                    </div>
                </SectionCard>
 
                {/* 3. Atributos dinámicos (aparece solo si hay tipo seleccionado) */}
                {atributosRequeridos.length > 0 && (
                    <SectionCard
                        icon={Layers}
                        title="Datos específicos del tipo"
                        accent="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {atributosRequeridos.map((attr) => {
                                const inputType = getInputType(attr);
                                return (
                                    <div key={attr}>
                                        <Label required>
                                            {ATRIBUTO_LABELS[attr] ?? attr}
                                        </Label>
                                        <input
                                            type={inputType}
                                            name={attr}
                                            value={form.atributos[attr] ?? ""}
                                            onChange={handleAtributoChange}
                                            min={inputType === "number" ? 0 : undefined}
                                            placeholder={inputType === "date" ? "" : `${ATRIBUTO_LABELS[attr] ?? attr}…`}
                                            className={inputBase}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </SectionCard>
                )}
 
                {/* 4. Archivo adjunto */}
                <SectionCard
                    icon={Upload}
                    title="Archivo adjunto (opcional)"
                    accent="text-gray-500 bg-gray-50 dark:bg-gray-700/30"
                >
                    {archivo ? (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg
                            bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                            <FileText size={18} className="text-[#EC7A21] shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                    {archivo.name}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {(archivo.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={removeArchivo}
                                className="text-gray-400 hover:text-red-500 transition shrink-0"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex flex-col items-center gap-2 px-4 py-8 rounded-lg
                                border-2 border-dashed border-gray-200 dark:border-gray-600
                                hover:border-[#EFB357] dark:hover:border-[#EFB357]
                                text-gray-400 hover:text-[#EC7A21] transition cursor-pointer"
                        >
                            <Upload size={22} />
                            <span className="text-sm">Haz clic para adjuntar un archivo</span>
                            <span className="text-xs opacity-70">PDF, DOC, DOCX, XLSX — máx. 20 MB</span>
                        </button>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.xlsx,.ppt,.pptx"
                        onChange={handleArchivoChange}
                        className="hidden"
                    />
                </SectionCard>
 
                {/* Botón submit */}
                <button
                    type="submit"
                    disabled={!isValid || loading}
                    className={`
                        w-full flex items-center justify-center gap-2 py-3 rounded-xl
                        text-sm font-bold tracking-wide transition
                        ${isValid && !loading
                            ? "bg-[#EC7A21] hover:bg-[#CF620C] text-white shadow-sm hover:shadow-md"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        }
                    `}
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Registrando…
                        </>
                    ) : (
                        "Registrar producto"
                    )}
                </button>
 
            </form>
        </div>
    );
};