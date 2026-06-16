import { Link } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { urlVistaDocente } from "../../../utils/publicDocenteNav";
import { descargarProductoPublico } from "../../../utils/publicProductoDownload";
import { DocenteEnlacePorNombre } from "./PublicDocenteBanner";
import { text } from "../../../components/ui/themeTokens";
import {
    DetallePill,
    DetalleMeta,
    FilaArchivoPublico,
    buildDetallePublicoSections,
} from "./productoPublicoDetalleUi";

export const ProductoPublicoDetalleContent = ({
    producto,
    etiquetasAtributos = {},
    onDescargar = descargarProductoPublico,
    onVerArchivo,
    onNavigateAway,
}) => {
    const {
        archivos, docente, programas, clasificacion, fechas, atributosConEtiqueta,
    } = buildDetallePublicoSections(producto, etiquetasAtributos);

    const docenteUrl = urlVistaDocente(producto);

    return (
        <div className="space-y-5">
            <header className="border-b border-gray-100 dark:border-gray-700 pb-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#EC7A21] mb-1">
                    Producto académico
                </p>
                <h2 className={`text-xl sm:text-2xl font-extrabold ${text.primary} leading-snug`}>
                    {producto.nombre}
                </h2>
                {docente && (
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <p className={`text-sm flex items-center gap-1.5 ${text.muted}`}>
                            <User size={14} className="shrink-0" aria-hidden="true" />
                            <DocenteEnlacePorNombre
                                nombre={docente}
                                className="font-semibold text-gray-800 dark:text-gray-200"
                            />
                        </p>
                        {docenteUrl && (
                            <Link
                                to={docenteUrl}
                                onClick={onNavigateAway}
                                className="text-xs font-semibold text-[#EC7A21] hover:underline"
                            >
                                Ver más productos de este docente
                            </Link>
                        )}
                    </div>
                )}
                {programas && (
                    <p className={`text-xs mt-1 ${text.muted}`}>Programas: {programas}</p>
                )}
            </header>

            <section>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Descripción</p>
                <p className={`text-sm leading-relaxed ${text.secondary}`}>
                    {producto.descripcion || "Sin descripción registrada."}
                </p>
            </section>

            <section>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Clasificación</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {clasificacion.map((item) => (
                        <DetallePill
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            accent={item.accent}
                        />
                    ))}
                </div>
            </section>

            <section>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">Fechas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {fechas.map((item) => (
                        <div
                            key={item.label}
                            className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3"
                        >
                            <DetalleMeta label={item.label} value={item.value} />
                        </div>
                    ))}
                </div>
            </section>

            {atributosConEtiqueta.length > 0 && (
                <section>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2.5">
                        Datos académicos
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {atributosConEtiqueta.map((item) => (
                            <div
                                key={item.key}
                                className="border border-gray-100 dark:border-gray-700 rounded-xl px-3.5 py-3"
                            >
                                <DetalleMeta label={item.label} value={item.value} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <section className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Archivos disponibles ({archivos.length})
                </p>
                {archivos.length === 0 ? (
                    <div className="flex items-center gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-500">
                        <Lock size={16} /> No hay archivos públicos disponibles para este producto.
                    </div>
                ) : (
                    archivos.map((archivo) => (
                        <FilaArchivoPublico
                            key={archivo.id ?? archivo.nombreOriginal}
                            archivo={archivo}
                            producto={producto}
                            onVer={onVerArchivo}
                            onDescargar={onDescargar}
                        />
                    ))
                )}
            </section>
        </div>
    );
};
