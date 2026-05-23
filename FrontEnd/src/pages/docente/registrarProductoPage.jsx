import { useRef, useEffect } from "react";
import { AlertCircle, Upload, X, FileText, Layers } from "lucide-react";
import { useRegistrarProducto } from "../../hooks/useRegistrarProducto";
import {
    ATRIBUTO_LABELS,
    ATRIBUTOS_FECHA,
    ATRIBUTOS_NUMERO,
} from "./productoConfig";
import { FormBanner } from "../../components/ui/FormBanner";
import { ClasificacionSection } from "../../components/ClasificacionSection";
import { notifySuccess, notifyError } from "../../utils/notify";

// UI primitivos locales

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

// Página principal de registro de producto para docentes

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

    // Notificación de éxito — se cierra sola en 2.5 s, luego resetea el estado
    useEffect(() => {
        if (!success) return;
        notifySuccess(
            "¡Producto registrado con éxito!",
            "Quedó en estado Sin publicar. Puedes editarlo o publicarlo desde Mis productos."
        ).then(resetSuccess);
    }, [success]);

    // Notificación de error — el usuario la cierra manualmente
    useEffect(() => {
        if (!error) return;
        notifyError("Error al registrar", error).then(resetError);
    }, [error]);

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
                <ClasificacionSection
                    form={form}
                    handleChange={handleChange}
                    subcategoriasDisponibles={subcategoriasDisponibles}
                    tiposDisponibles={tiposDisponibles}
                />

                {/* 3. Atributos dinámicos */}
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
                                        <Label required>{ATRIBUTO_LABELS[attr] ?? attr}</Label>
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

                {/* Submit */}
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

