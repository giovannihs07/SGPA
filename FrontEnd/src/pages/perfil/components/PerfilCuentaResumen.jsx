import { card, text, labelBold } from "../../../components/ui/themeTokens";
import { etiquetasRoles, etiquetaEstado } from "../perfilHelpers";

const CampoLectura = ({ label, value }) => (
    <div>
        <p className={`${labelBold} mb-1 normal-case tracking-normal`}>{label}</p>
        <p className={`text-sm ${text.secondary}`}>{value || "—"}</p>
    </div>
);

export const PerfilCuentaResumen = ({ perfil }) => (
    <section className={`${card} p-5`}>
        <h3 className={`text-sm font-bold ${text.primary} mb-4`}>Información de la cuenta</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoLectura label="Correo institucional" value={perfil?.email} />
            <CampoLectura label="Cédula" value={perfil?.cedula} />
            <CampoLectura label="Rol" value={etiquetasRoles(perfil?.roles)} />
            <CampoLectura label="Estado" value={etiquetaEstado(perfil?.estado)} />
        </div>
        <p className={`mt-4 text-xs ${text.muted}`}>
            El correo, la cédula y los roles solo pueden modificarse por un administrador.
        </p>
    </section>
);
