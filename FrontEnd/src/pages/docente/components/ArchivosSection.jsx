import { useRef } from "react";
import { Upload, X, FileText, Plus } from "lucide-react";
import { SectionCard } from "../../../components/ui/SectionCard";
import { selectSm } from "../../../components/ui/themeTokens";
import {
    ACCEPT_ARCHIVO,
    ETIQUETA_FORMATOS_ARCHIVO,
    ROLES_ARCHIVO,
    ROL_PRINCIPAL,
    MAX_ARCHIVOS,
    etiquetaRolArchivo,
    tieneArchivoPrincipal,
    totalArchivosActivos,
} from "../../../config/productoArchivo";

const FilaArchivoNuevo = ({ item, onCambiarRol, onQuitar, principalOcupado }) => (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border
        border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
        <FileText size={16} className="text-[#EC7A21] shrink-0" />
        <div className="flex-1 min-w-[140px]">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                {item.file.name}
            </p>
            <p className="text-xs text-gray-400">
                {(item.file.size / 1024 / 1024).toFixed(2)} MB · Nuevo
            </p>
        </div>
        <select
            value={item.rol}
            onChange={(e) => onCambiarRol(item.localId, e.target.value)}
            className={`${selectSm} max-w-[130px]`}
        >
            {ROLES_ARCHIVO.map((r) => (
                <option
                    key={r.value}
                    value={r.value}
                    disabled={r.value === ROL_PRINCIPAL && principalOcupado && item.rol !== ROL_PRINCIPAL}
                >
                    {r.label}
                </option>
            ))}
        </select>
        <button
            type="button"
            onClick={() => onQuitar(item.localId)}
            className="text-gray-400 hover:text-red-500 transition shrink-0"
            title="Quitar"
        >
            <X size={16} />
        </button>
    </div>
);

const FilaArchivoGuardado = ({ item, onQuitar }) => (
    <div className="flex items-center gap-2 p-3 rounded-lg border
        border-orange-100 dark:border-orange-800/40 bg-orange-50/50 dark:bg-orange-900/10">
        <FileText size={16} className="text-[#EC7A21] shrink-0" />
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                {item.nombreOriginal}
            </p>
            <p className="text-xs text-gray-400">
                {etiquetaRolArchivo(item.rol)} · Archivo actual
            </p>
        </div>
        <button
            type="button"
            onClick={() => onQuitar(item.id)}
            className="text-gray-400 hover:text-red-500 transition shrink-0"
            title="Eliminar al guardar"
        >
            <X size={16} />
        </button>
    </div>
);

export const ArchivosSection = ({
    archivosNuevos,
    archivosGuardados,
    archivosEliminarIds,
    onAgregar,
    onQuitarNuevo,
    onCambiarRolNuevo,
    onQuitarGuardado,
}) => {
    const fileInputRef = useRef(null);
    const principalOcupado = tieneArchivoPrincipal(
        archivosGuardados, archivosNuevos, archivosEliminarIds,
    );
    const total = totalArchivosActivos(
        archivosGuardados, archivosNuevos, archivosEliminarIds,
    );
    const puedeAgregar = total < MAX_ARCHIVOS;

    const guardadosVisibles = (archivosGuardados ?? []).filter(
        (a) => !archivosEliminarIds.includes(a.id),
    );

    return (
        <SectionCard
            icon={Upload}
            title="Archivos adjuntos"
            accent="text-gray-500 bg-gray-50 dark:bg-gray-700/30"
        >
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                El archivo <strong>Principal</strong> es obligatorio. {ETIQUETA_FORMATOS_ARCHIVO}
            </p>

            <div className="space-y-2">
                {guardadosVisibles.map((a) => (
                    <FilaArchivoGuardado
                        key={a.id}
                        item={a}
                        onQuitar={onQuitarGuardado}
                    />
                ))}
                {archivosNuevos.map((a) => (
                    <FilaArchivoNuevo
                        key={a.localId}
                        item={a}
                        onCambiarRol={onCambiarRolNuevo}
                        onQuitar={onQuitarNuevo}
                        principalOcupado={principalOcupado}
                    />
                ))}
            </div>

            {puedeAgregar ? (
                <>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                            border-2 border-dashed border-gray-200 dark:border-gray-600
                            hover:border-[#EFB357] text-sm text-gray-500 hover:text-[#EC7A21] transition"
                    >
                        {total === 0 ? (
                            <>
                                <Upload size={16} />
                                Adjuntar archivo principal
                            </>
                        ) : (
                            <>
                                <Plus size={16} />
                                Añadir otro archivo
                            </>
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPT_ARCHIVO}
                        onChange={onAgregar}
                        className="hidden"
                    />
                </>
            ) : (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                    Máximo {MAX_ARCHIVOS} archivos por producto.
                </p>
            )}
        </SectionCard>
    );
};
