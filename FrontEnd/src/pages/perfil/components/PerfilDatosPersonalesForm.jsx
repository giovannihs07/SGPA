import { FieldError } from "../../../components/ui/FieldError";
import { LoadingButton } from "../../../components/ui/LoadingButton";
import { card, inputMd, inputError, labelBold, btnPrimary, text } from "../../../components/ui/themeTokens";

export const PerfilDatosPersonalesForm = ({
    datos,
    fieldErrors,
    saving,
    onChange,
    onSubmit,
}) => (
    <section className={`${card} p-5`}>
        <h3 className={`text-sm font-bold ${text.primary} mb-4`}>Datos personales</h3>
        <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="nombre" className={labelBold}>Nombre</label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={datos.nombre}
                        onChange={onChange}
                        autoComplete="given-name"
                        aria-invalid={!!fieldErrors.nombre || undefined}
                        className={`${inputMd} ${fieldErrors.nombre ? inputError : ""}`}
                    />
                    <FieldError message={fieldErrors.nombre} />
                </div>
                <div>
                    <label htmlFor="apellido" className={labelBold}>Apellido</label>
                    <input
                        id="apellido"
                        name="apellido"
                        type="text"
                        value={datos.apellido}
                        onChange={onChange}
                        autoComplete="family-name"
                        aria-invalid={!!fieldErrors.apellido || undefined}
                        className={`${inputMd} ${fieldErrors.apellido ? inputError : ""}`}
                    />
                    <FieldError message={fieldErrors.apellido} />
                </div>
            </div>
            <div>
                <label htmlFor="telefono" className={labelBold}>Teléfono</label>
                <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    value={datos.telefono}
                    onChange={onChange}
                    autoComplete="tel"
                    placeholder="Opcional"
                    className={inputMd}
                />
            </div>
            <LoadingButton loading={saving} className={btnPrimary}>
                Guardar cambios
            </LoadingButton>
        </form>
    </section>
);
