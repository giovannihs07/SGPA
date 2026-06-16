import { Lock, Paperclip } from "lucide-react";
import { etiquetaRolArchivo } from "../../../config/productoArchivo";
import { ArchivoAccionesPdf } from "../../../components/ui/ArchivoAccionesPdf";
import {
    TIPO_LABELS, SUBCATEGORIA_LABELS, CATEGORIA_LABELS,
    formatFecha, etiquetaAtributo, obtenerArchivosProducto,
    puedeDescargarArchivo, etiquetaAccesoArchivo,
} from "../../docente/components/productoHelpers";

export const DetallePill = ({ label, value, accent = "border-[#EC7A21]" }) => (
    <div className={`bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700
        rounded-xl px-3 py-2.5 border-l-[3px] ${accent}`}>
        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug">{value || "—"}</p>
    </div>
);

export const DetalleMeta = ({ label, value }) => (
    <div>
        <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{value || "—"}</p>
    </div>
);

export const FilaArchivoPublico = ({ archivo, producto, onVer, onDescargar }) => {
    const ext = archivo.extensionArchivo
        ?? (archivo.nombreOriginal?.includes(".")
            ? archivo.nombreOriginal.split(".").pop().toUpperCase()
            : null);
    const descargable = puedeDescargarArchivo(archivo);

    return (
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border
            bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10
            border-orange-200 dark:border-orange-800">
            <div className="w-9 h-9 rounded-xl bg-[#EC7A21] flex items-center justify-center shrink-0">
                <Paperclip size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-[140px]">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">
                    {etiquetaRolArchivo(archivo.rol)} · {etiquetaAccesoArchivo(archivo)}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                    {archivo.nombreOriginal}
                </p>
            </div>
            {ext && (
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-md
                    bg-white dark:bg-gray-800 text-[#EC7A21] border border-orange-200">
                    {ext}
                </span>
            )}
            {descargable && (
                <ArchivoAccionesPdf
                    archivo={archivo}
                    producto={producto}
                    descargable={descargable}
                    onVer={onVer}
                    onDescargar={onDescargar}
                />
            )}
        </div>
    );
};

export const nombreDocentePublico = (p) => {
    const partes = [p?.docenteNombre, p?.docenteApellido].filter(Boolean);
    return partes.length ? partes.join(" ") : null;
};

export const buildDetallePublicoSections = (producto, etiquetasAtributos = {}) => {
    const archivos = obtenerArchivosProducto(producto).filter((a) => a.accesoPublico !== false);
    const atributos = Object.entries(producto.atributos ?? {});
    const docente = nombreDocentePublico(producto);
    const programas = producto.programas?.length ? [...producto.programas].join(", ") : null;

    return {
        archivos,
        atributos,
        docente,
        programas,
        clasificacion: [
            { label: "Categoría", value: CATEGORIA_LABELS[producto.categoria] ?? producto.categoria },
            {
                label: "Subcategoría",
                value: SUBCATEGORIA_LABELS[producto.subcategoria] ?? producto.subcategoria,
                accent: "border-[#EFB357]",
            },
            {
                label: "Tipo",
                value: TIPO_LABELS[producto.tipo] ?? producto.tipo,
                accent: "border-[#ffc20e]",
            },
        ],
        fechas: [
            { label: "Registrado en SGPA", value: formatFecha(producto.fechaRegistroSgpa) },
            { label: "Publicado en SGPA", value: formatFecha(producto.fechaPublicacionSgpa) },
        ],
        atributosConEtiqueta: atributos.map(([k, v]) => ({
            key: k,
            label: etiquetaAtributo(k, etiquetasAtributos),
            value: String(v),
        })),
    };
};
