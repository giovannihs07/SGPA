import { SectionHeader } from "../../../components/ui/SectionHeader";
import { SelectWithArrow } from "../../../components/ui/SelectWithArrow";
import { RepeatCard } from "../../../components/ui/RepeatCard";
import { FieldError } from "../../../components/ui/FieldError";
import { LoadingButton } from "../../../components/ui/LoadingButton";
import { labelBold, btnPrimary, text } from "../../../components/ui/themeTokens";

const req = <span className="text-[#EC7A21]">*</span>;

export const PerfilProgramasEditor = ({
    programas,
    fieldErrors,
    saving,
    facultades,
    getProgramas,
    cargarProgramas,
    loadingFacultades,
    errorFacultades,
    onProgramaChange,
    onAddPrograma,
    onRemovePrograma,
    onSubmit,
}) => (
    <div>
        <SectionHeader
            title={<>Programas asignados {req}</>}
            onAdd={onAddPrograma}
            addLabel="Añadir programa"
        />
        <p className={`text-xs ${text.muted} mb-3`}>
            Debes mantener al menos un programa asignado.
        </p>

        {errorFacultades && (
            <p className="text-xs text-red-500 mb-2" role="alert">{errorFacultades}</p>
        )}
        <FieldError message={fieldErrors.programas} />

        <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-2">
                {programas.map((p, i) => {
                    const programasOpciones = getProgramas(p.facultadId);
                    const facultadError = fieldErrors[`programas.${i}.facultadId`];
                    const programaError = fieldErrors[`programas.${i}.programaId`];

                    return (
                        <RepeatCard
                            key={i}
                            index={i}
                            total={programas.length}
                            onRemove={onRemovePrograma}
                        >
                            <p className="text-xs font-bold text-gray-500 mb-1">Programa {i + 1}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <label className={labelBold}>Facultad {req}</label>
                                    <SelectWithArrow
                                        value={p.facultadId}
                                        onChange={({ target }) => {
                                            const facultadId = Number(target.value);
                                            const facultadNombre = facultades.find((f) => f.id === facultadId)?.nombre ?? "";
                                            onProgramaChange(i, "facultadId", facultadId, { facultadNombre });
                                            cargarProgramas(facultadId);
                                        }}
                                        options={facultades.map((f) => ({ value: f.id, label: f.nombre }))}
                                        placeholder={loadingFacultades ? "Cargando…" : "Selecciona facultad"}
                                        disabled={loadingFacultades}
                                        useObjectOptions
                                        hasError={!!facultadError}
                                    />
                                    <FieldError message={facultadError} />
                                </div>
                                <div>
                                    <label className={labelBold}>
                                        Programa {req}{" "}
                                        {!p.facultadId && (
                                            <span className="font-light text-gray-400">(elige facultad primero)</span>
                                        )}
                                    </label>
                                    <SelectWithArrow
                                        value={p.programaId}
                                        onChange={({ target }) => {
                                            const programaId = Number(target.value);
                                            const programaNombre = programasOpciones.find((pr) => pr.id === programaId)?.nombre ?? "";
                                            onProgramaChange(i, "programaId", programaId, { programaNombre });
                                        }}
                                        options={programasOpciones.map((pr) => ({ value: pr.id, label: pr.nombre }))}
                                        placeholder={p.facultadId ? "Selecciona programa" : "— elige facultad —"}
                                        disabled={!p.facultadId}
                                        useObjectOptions
                                        hasError={!!programaError}
                                    />
                                    <FieldError message={programaError} />
                                </div>
                            </div>
                        </RepeatCard>
                    );
                })}
            </div>

            <LoadingButton loading={saving} className={btnPrimary}>
                Guardar programas
            </LoadingButton>
        </form>
    </div>
);
