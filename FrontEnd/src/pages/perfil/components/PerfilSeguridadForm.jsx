import { FieldError } from "../../../components/ui/FieldError";
import { PasswordInput } from "../../../components/ui/PasswordInput";
import { LoadingButton } from "../../../components/ui/LoadingButton";
import { card, labelBold, btnPrimary, text } from "../../../components/ui/themeTokens";

export const PerfilSeguridadForm = ({
    passwords,
    fieldErrors,
    saving,
    onChange,
    onSubmit,
}) => (
    <section className={`${card} p-5`}>
        <h3 className={`text-sm font-bold ${text.primary} mb-1`}>Seguridad</h3>
        <p className={`text-xs ${text.muted} mb-4`}>Actualiza tu contraseña de acceso a SGPA.</p>
        <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
            <div>
                <label htmlFor="passwordActual" className={labelBold}>Contraseña actual</label>
                <PasswordInput
                    id="passwordActual"
                    name="passwordActual"
                    value={passwords.passwordActual}
                    onChange={onChange}
                    autoComplete="current-password"
                    hasError={!!fieldErrors.passwordActual}
                />
                <FieldError message={fieldErrors.passwordActual} />
            </div>
            <div>
                <label htmlFor="passwordNuevo" className={labelBold}>Nueva contraseña</label>
                <PasswordInput
                    id="passwordNuevo"
                    name="passwordNuevo"
                    value={passwords.passwordNuevo}
                    onChange={onChange}
                    autoComplete="new-password"
                    hasError={!!fieldErrors.passwordNuevo}
                />
                <FieldError message={fieldErrors.passwordNuevo} />
            </div>
            <div>
                <label htmlFor="passwordConfirmacion" className={labelBold}>Confirmar nueva contraseña</label>
                <PasswordInput
                    id="passwordConfirmacion"
                    name="passwordConfirmacion"
                    value={passwords.passwordConfirmacion}
                    onChange={onChange}
                    autoComplete="new-password"
                    hasError={!!fieldErrors.passwordConfirmacion}
                />
                <FieldError message={fieldErrors.passwordConfirmacion} />
            </div>
            <LoadingButton loading={saving} className={btnPrimary}>
                Cambiar contraseña
            </LoadingButton>
        </form>
    </section>
);
