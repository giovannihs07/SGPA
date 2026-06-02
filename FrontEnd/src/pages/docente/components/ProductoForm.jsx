import { AlertCircle, FileText } from "lucide-react";
import { SectionCard } from "../../../components/ui/SectionCard";
import { Label } from "../../../components/ui/Label";
import { ClasificacionSection } from "./ClasificacionSection";
import { AtributosSection } from "./AtributosSection";
import { ArchivoSection } from "./ArchivoSection";
import { INPUT_BASE } from "./productoFormUtils";

export const ProductoForm = ({
    loadingTipos, errorTipos,
    categoriasDisponibles,
    subcategoriasDisponibles,
    tiposDisponibles,
    atributosDef,
    form, archivo, archivoActual, loading, isValid,
    handleChange, handleAtributoChange,
    handleArchivoChange, removeArchivo,
    handleSubmit,
    submitLabel = "Guardar producto",
    loadingLabel = "Guardando…",
}) => {
    if (loadingTipos) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3 text-gray-400">
                <div className="w-8 h-8 border-2 border-[#EFB357] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Cargando clasificación de productos…</span>
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

    if (!categoriasDisponibles?.length) return (
        <div className="flex items-center justify-center min-h-[40vh]">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
                No hay tipos de producto configurados. Contacta al administrador para
                cargar la taxonomía en Configuración → Productos.
            </p>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                        className={INPUT_BASE}
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
                        className={`${INPUT_BASE} resize-none`}
                    />
                </div>
            </SectionCard>

            <ClasificacionSection
                form={form}
                handleChange={handleChange}
                categoriasDisponibles={categoriasDisponibles}
                subcategoriasDisponibles={subcategoriasDisponibles}
                tiposDisponibles={tiposDisponibles}
            />

            <AtributosSection
                atributosDef={atributosDef}
                atributos={form.atributos}
                onAtributoChange={handleAtributoChange}
            />

            <ArchivoSection
                archivo={archivo}
                archivoActual={archivoActual}
                onArchivoChange={handleArchivoChange}
                onRemove={removeArchivo}
            />

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
                        {loadingLabel}
                    </>
                ) : submitLabel}
            </button>
        </form>
    );
};
