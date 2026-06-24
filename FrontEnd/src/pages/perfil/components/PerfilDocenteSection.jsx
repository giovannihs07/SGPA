import { Trash2 } from "lucide-react";
import { tipoContratoOptions, nivelOptions } from "../../auth/registerConfig";
import { SelectWithArrow } from "../../../components/ui/SelectWithArrow";
import { FieldError } from "../../../components/ui/FieldError";
import { LoadingButton } from "../../../components/ui/LoadingButton";
import {
    card,
    inputMd,
    inputError,
    labelBold,
    btnPrimary,
    btnGhost,
    text,
} from "../../../components/ui/themeTokens";
import { PerfilProgramasEditor } from "./PerfilProgramasEditor";

const CampoLectura = ({ label, value }) => (
    <div>
        <p className={`${labelBold} mb-1 normal-case tracking-normal`}>{label}</p>
        <p className={`text-sm ${text.secondary}`}>{value || "—"}</p>
    </div>
);

export const PerfilDocenteSection = ({
    perfil,
    docente,
    programas,
    nuevoTitulo,
    fieldErrorsDocente,
    fieldErrorsProgramas,
    fieldErrorsTitulo,
    savingDocente,
    savingProgramas,
    savingTitulo,
    deletingTituloId,
    facultades,
    getProgramas,
    cargarProgramas,
    loadingFacultades,
    errorFacultades,
    onDocenteChange,
    onProgramaChange,
    onAddPrograma,
    onRemovePrograma,
    onTituloChange,
    onGuardarDocente,
    onGuardarProgramas,
    onAgregarTitulo,
    onEliminarTitulo,
}) => {
    const titulos = perfil?.titulos ?? [];
    const codigoPendiente = !perfil?.codigoDocente?.trim();

    return (
        <section className={`${card} p-5 space-y-6`}>
            <div>
                <h3 className={`text-sm font-bold ${text.primary}`}>Perfil docente</h3>
                <p className={`text-xs ${text.muted} mt-1`}>
                    {codigoPendiente
                        ? "Completa tu código docente, tipo de contrato, programas y títulos académicos."
                        : "Actualiza tu tipo de contrato, programas asignados y títulos académicos."}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                {codigoPendiente ? (
                    <div>
                        <label htmlFor="codigoDocente" className={labelBold}>Código docente</label>
                        <input
                            id="codigoDocente"
                            name="codigoDocente"
                            type="text"
                            value={docente.codigoDocente}
                            onChange={onDocenteChange}
                            placeholder="Ej. DOC-2024-001"
                            autoComplete="off"
                            aria-invalid={!!fieldErrorsDocente.codigoDocente || undefined}
                            className={`${inputMd} ${fieldErrorsDocente.codigoDocente ? inputError : ""}`}
                        />
                        <FieldError message={fieldErrorsDocente.codigoDocente} />
                    </div>
                ) : (
                    <CampoLectura label="Código docente" value={perfil?.codigoDocente} />
                )}
                <div>
                    <label htmlFor="tipoContrato" className={labelBold}>Tipo de contrato</label>
                    <SelectWithArrow
                        id="tipoContrato"
                        name="tipoContrato"
                        value={docente.tipoContrato}
                        onChange={onDocenteChange}
                        options={tipoContratoOptions.map((o) => ({ value: o, label: o }))}
                        placeholder="Selecciona un tipo"
                        useObjectOptions
                        hasError={!!fieldErrorsDocente.tipoContrato}
                    />
                    <FieldError message={fieldErrorsDocente.tipoContrato} />
                </div>
            </div>

            <form onSubmit={onGuardarDocente}>
                <LoadingButton loading={savingDocente} className={btnPrimary}>
                    {codigoPendiente ? "Guardar perfil docente" : "Guardar tipo de contrato"}
                </LoadingButton>
            </form>

            <PerfilProgramasEditor
                programas={programas}
                fieldErrors={fieldErrorsProgramas}
                saving={savingProgramas}
                facultades={facultades}
                getProgramas={getProgramas}
                cargarProgramas={cargarProgramas}
                loadingFacultades={loadingFacultades}
                errorFacultades={errorFacultades}
                onProgramaChange={onProgramaChange}
                onAddPrograma={onAddPrograma}
                onRemovePrograma={onRemovePrograma}
                onSubmit={onGuardarProgramas}
            />

            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-4">
                <p className={`${labelBold} mb-0 normal-case tracking-normal`}>Títulos académicos</p>

                {titulos.length === 0 ? (
                    <p className={`text-sm ${text.muted}`}>Aún no has registrado títulos académicos.</p>
                ) : (
                    <div className="space-y-2">
                        {titulos.map((t) => (
                            <div
                                key={t.id}
                                className="flex items-start justify-between gap-3 rounded-lg border
                                    border-gray-100 dark:border-gray-700 px-3 py-2.5"
                            >
                                <div className="min-w-0">
                                    <p className={`text-sm font-semibold ${text.primary}`}>{t.titulo}</p>
                                    <p className={`text-xs ${text.muted} mt-0.5`}>
                                        {[t.nivel, t.institucion, t.pais].filter(Boolean).join(" · ")}
                                        {t.fechaObtencion ? ` · ${t.fechaObtencion}` : ""}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onEliminarTitulo(t.id)}
                                    disabled={deletingTituloId === t.id}
                                    title="Eliminar título"
                                    className={`${btnGhost} px-2 py-1.5 text-red-600 dark:text-red-400
                                        hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <form onSubmit={onAgregarTitulo} className="space-y-3 max-w-xl pt-2">
                    <p className={`text-xs font-semibold ${text.secondary}`}>Añadir título</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="tituloNuevo" className={labelBold}>Título</label>
                            <input
                                id="tituloNuevo"
                                name="titulo"
                                type="text"
                                value={nuevoTitulo.titulo}
                                onChange={onTituloChange}
                                className={`${inputMd} ${fieldErrorsTitulo.titulo ? inputError : ""}`}
                            />
                            <FieldError message={fieldErrorsTitulo.titulo} />
                        </div>
                        <div>
                            <label htmlFor="nivelNuevo" className={labelBold}>Nivel</label>
                            <SelectWithArrow
                                id="nivelNuevo"
                                name="nivel"
                                value={nuevoTitulo.nivel}
                                onChange={onTituloChange}
                                options={nivelOptions.map((n) => ({ value: n, label: n }))}
                                placeholder="Selecciona nivel"
                                useObjectOptions
                                hasError={!!fieldErrorsTitulo.nivel}
                            />
                            <FieldError message={fieldErrorsTitulo.nivel} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="institucionNuevo" className={labelBold}>Institución</label>
                            <input
                                id="institucionNuevo"
                                name="institucion"
                                type="text"
                                value={nuevoTitulo.institucion}
                                onChange={onTituloChange}
                                className={`${inputMd} ${fieldErrorsTitulo.institucion ? inputError : ""}`}
                            />
                            <FieldError message={fieldErrorsTitulo.institucion} />
                        </div>
                        <div>
                            <label htmlFor="paisNuevo" className={labelBold}>País</label>
                            <input
                                id="paisNuevo"
                                name="pais"
                                type="text"
                                value={nuevoTitulo.pais}
                                onChange={onTituloChange}
                                className={inputMd}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="fechaObtencionNuevo" className={labelBold}>Fecha de obtención</label>
                        <input
                            id="fechaObtencionNuevo"
                            name="fechaObtencion"
                            type="date"
                            value={nuevoTitulo.fechaObtencion}
                            onChange={onTituloChange}
                            className={inputMd}
                        />
                    </div>
                    <LoadingButton loading={savingTitulo} className={btnPrimary}>
                        Añadir título
                    </LoadingButton>
                </form>
            </div>
        </section>
    );
};
