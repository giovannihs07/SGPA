import { AlertCircle, FileText } from "lucide-react";
import { useRegistrarProducto }  from "../../hooks/useRegistrarProducto";
import { SectionCard }           from "../../components/ui/SectionCard";
import { Label }                 from "../../components/ui/Label";
import { ClasificacionSection }  from "../../pages/docente/components/ClasificacionSection";
import { AtributosSection }      from "./components/AtributosSection";
import { ArchivoSection }        from "./components/ArchivoSection";

const inputBase =
    "w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 " +
    "placeholder-gray-300 dark:placeholder-gray-600 " +
    "focus:outline-none focus:ring-2 focus:ring-[#EFB357]/50 focus:border-[#EFB357] " +
    "transition disabled:opacity-40 disabled:cursor-not-allowed";

export const RegistrarProductoPage = () => {
    const {
        loadingTipos, errorTipos,
        subcategoriasDisponibles, tiposDisponibles, atributosRequeridos,
        form, archivo, loading, isValid,
        handleChange, handleAtributoChange,
        handleArchivoChange, removeArchivo,
        handleSubmit,
    } = useRegistrarProducto();

    if (loadingTipos) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3 text-gray-400">
                <div className="w-8 h-8 border-2 border-[#EFB357] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Cargando tipos de producto…</span>
            </div>
        </div>
    );

    if (errorTipos) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg text-sm">
                <AlertCircle size={16} />
                {errorTipos}
            </div>
        </div>
    );

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
                <AtributosSection
                    atributosRequeridos={atributosRequeridos}
                    atributos={form.atributos}
                    onAtributoChange={handleAtributoChange}
                />

                {/* 4. Archivo adjunto */}
                <ArchivoSection
                    archivo={archivo}
                    onArchivoChange={handleArchivoChange}
                    onRemove={removeArchivo}
                />

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
