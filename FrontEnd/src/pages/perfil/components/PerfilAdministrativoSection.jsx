import { AdministrativoFields } from "../../auth/components/AdministrativoFields";
import { LoadingButton } from "../../../components/ui/LoadingButton";
import { card, btnPrimary, text } from "../../../components/ui/themeTokens";

export const PerfilAdministrativoSection = ({
    administrativo,
    fieldErrors,
    saving,
    onChange,
    onSubmit,
}) => (
    <section className={`${card} p-5 space-y-4`}>
        <div>
            <h3 className={`text-sm font-bold ${text.primary}`}>Perfil administrativo</h3>
            <p className={`text-xs ${text.muted} mt-1`}>
                Actualiza tu cargo y dependencia institucional en SGPA.
            </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
            <AdministrativoFields
                cargo={administrativo.cargo}
                dependencia={administrativo.dependencia}
                onInputChange={onChange}
                fieldErrors={fieldErrors}
            />
            <LoadingButton loading={saving} className={btnPrimary}>
                Guardar perfil administrativo
            </LoadingButton>
        </form>
    </section>
);
