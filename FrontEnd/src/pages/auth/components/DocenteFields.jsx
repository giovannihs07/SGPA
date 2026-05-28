import { nivelOptions, tipoContratoOptions } from "../registerConfig";
import { SelectWithArrow } from "../../../components/ui/SelectWithArrow";
import { SectionHeader }   from "../../../components/ui/SectionHeader";
import { RepeatCard }      from "../../../components/ui/RepeatCard";
import { inputAuth, labelBold } from "../../../components/ui/themeTokens";

export const DocenteFields = ({
    codigoDocente, tipoContrato, onInputChange,  // ← tipoContrato añadido
    programas, onProgramaChange, addPrograma, removePrograma,
    titulos,   onTituloChange,   addTitulo,   removeTitulo,
    facultades, getProgramas, cargarProgramas,
    loadingFacultades, errorFacultades,
}) => (
    <>
        {/* Código docente y tipo de contrato */}
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className={labelBold}>
                    Código docente <span className="text-[#EC7A21]">*</span>
                </label>
                <input
                    type="text"
                    name="codigoDocente"
                    value={codigoDocente}
                    onChange={onInputChange}
                    placeholder="Ej. DOC-2024-001"
                    autoComplete="off"
                    className={inputAuth}
                />
            </div>

            {/* Tipo de contrato */}
            <div>
                <label className={labelBold}>
                    Tipo de contrato <span className="text-[#EC7A21]">*</span>
                </label>
                <SelectWithArrow
                    name="tipoContrato"
                    value={tipoContrato}
                    onChange={onInputChange}
                    options={tipoContratoOptions}
                    placeholder="Selecciona un tipo"
                />
            </div>
        </div>

        {/* Programas repetibles */}
        <div>
            <SectionHeader
                title={<>Facultad y programa <span className="text-[#EC7A21]">*</span></>}
                onAdd={addPrograma}
                addLabel="Añadir programa"
            />

            {errorFacultades && (
                <p className="text-xs text-red-500 mb-2">{errorFacultades}</p>
            )}

            <div className="space-y-2">
                {programas.map((p, i) => {
                    const programasOpciones = getProgramas(p.facultadId);
                    return (
                        <RepeatCard key={i} index={i} total={programas.length} onRemove={removePrograma}>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className={labelBold}>Facultad</label>
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
                                    />
                                </div>
                                <div>
                                    <label className={labelBold}>
                                        Programa{" "}
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
                                    />
                                </div>
                            </div>
                        </RepeatCard>
                    );
                })}
            </div>
        </div>

        {/* Títulos académicos repetibles */}
        <div>
            <SectionHeader
                title={<>Títulos académicos <span className="text-[#EC7A21]">*</span></>}
                onAdd={addTitulo}
                addLabel="Añadir título"
            />
            <div className="space-y-2">
                {titulos.map((t, i) => (
                    <RepeatCard key={i} index={i} total={titulos.length} onRemove={removeTitulo}>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelBold}>Título</label>
                                <input
                                    type="text"
                                    value={t.titulo}
                                    onChange={({ target }) => onTituloChange(i, "titulo", target.value)}
                                    placeholder="Ej. Ingeniería de Sistemas"
                                    className={inputAuth}
                                />
                            </div>
                            <div>
                                <label className={labelBold}>Nivel</label>
                                <SelectWithArrow
                                    value={t.nivel}
                                    onChange={({ target }) => onTituloChange(i, "nivel", target.value)}
                                    options={nivelOptions.map(n => ({ value: n, label: n }))}
                                    placeholder="Selecciona nivel"
                                    useObjectOptions
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className={labelBold}>Institución</label>
                                <input
                                    type="text"
                                    value={t.institucion}
                                    onChange={({ target }) => onTituloChange(i, "institucion", target.value)}
                                    placeholder="Ej. Universidad de Cartagena"
                                    className={inputAuth}
                                />
                            </div>
                            <div>
                                <label className={labelBold}>País</label>
                                <input
                                    type="text"
                                    value={t.pais}
                                    onChange={({ target }) => onTituloChange(i, "pais", target.value)}
                                    placeholder="Ej. Colombia"
                                    className={inputAuth}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelBold}>Fecha de obtención</label>
                            <input
                                type="date"
                                value={t.fechaObtencion}
                                onChange={({ target }) => onTituloChange(i, "fechaObtencion", target.value)}
                                className={inputAuth}
                            />
                        </div>
                    </RepeatCard>
                ))}
            </div>
        </div>
    </>
);