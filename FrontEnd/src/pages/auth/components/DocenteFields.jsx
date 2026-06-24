import { tipoContratoOptions } from "../registerConfig";
import { SelectWithArrow } from "../../../components/ui/SelectWithArrow";
import { SectionHeader }   from "../../../components/ui/SectionHeader";
import { RepeatCard }      from "../../../components/ui/RepeatCard";
import { FieldError }      from "../../../components/ui/FieldError";
import { inputAuth, inputError, labelBold } from "../../../components/ui/themeTokens";

const req = <span className="text-[#EC7A21]">*</span>;

export const DocenteFields = ({
    codigoDocente, tipoContrato, onInputChange,
    programas, onProgramaChange, addPrograma, removePrograma,
    facultades, getProgramas, cargarProgramas,
    loadingFacultades, errorFacultades,
    fieldErrors = {},
}) => (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
                <label htmlFor="codigoDocente" className={labelBold}>
                    Código docente {req}
                </label>
                <input
                    id="codigoDocente"
                    type="text"
                    name="codigoDocente"
                    value={codigoDocente}
                    onChange={onInputChange}
                    placeholder="Ej. DOC-2024-001"
                    autoComplete="off"
                    aria-invalid={!!fieldErrors.codigoDocente || undefined}
                    className={`${inputAuth} ${fieldErrors.codigoDocente ? inputError : ""}`}
                />
                <FieldError message={fieldErrors.codigoDocente} />
            </div>

            <div>
                <label htmlFor="tipoContrato" className={labelBold}>
                    Tipo de contrato {req}
                </label>
                <SelectWithArrow
                    name="tipoContrato"
                    value={tipoContrato}
                    onChange={onInputChange}
                    options={tipoContratoOptions}
                    placeholder="Selecciona un tipo"
                    hasError={!!fieldErrors.tipoContrato}
                />
                <FieldError message={fieldErrors.tipoContrato} />
            </div>
        </div>

        <div>
            <SectionHeader
                title={<>Facultad y programa {req}</>}
                onAdd={addPrograma}
                addLabel="Añadir programa"
            />

            {errorFacultades && (
                <p className="text-xs text-red-500 mb-2" role="alert">{errorFacultades}</p>
            )}

            <div className="space-y-2">
                {programas.map((p, i) => {
                    const programasOpciones = getProgramas(p.facultadId);
                    const facultadError = fieldErrors[`programas.${i}.facultadId`];
                    const programaError = fieldErrors[`programas.${i}.programaId`];

                    return (
                        <RepeatCard key={i} index={i} total={programas.length} onRemove={removePrograma}>
                            <p className="text-xs font-bold text-gray-500 mb-1">Programa {i + 1}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <label className={labelBold}>Facultad {req}</label>
                                    <SelectWithArrow
                                        value={p.facultadId}
                                        onChange={({ target }) => {
                                            const facultadId = Number(target.value);
                                            const facultadNombre = facultades.find(f => f.id === facultadId)?.nombre ?? "";
                                            onProgramaChange(i, "facultadId", facultadId, { facultadNombre });
                                            cargarProgramas(facultadId);
                                        }}
                                        options={facultades.map(f => ({ value: f.id, label: f.nombre }))}
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
                                            const programaNombre = programasOpciones.find(pr => pr.id === programaId)?.nombre ?? "";
                                            onProgramaChange(i, "programaId", programaId, { programaNombre });
                                        }}
                                        options={programasOpciones.map(pr => ({ value: pr.id, label: pr.nombre }))}
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
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
            Podrás añadir tus títulos académicos después de crear la cuenta, desde la sección{" "}
            <span className="font-semibold text-gray-600">Mi perfil</span>.
        </p>
    </>
);
