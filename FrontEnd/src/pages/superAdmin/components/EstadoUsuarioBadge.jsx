import { getEstadoUsuarioConfig } from "../superAdminHelpers";

export const EstadoUsuarioBadge = ({ estado }) => {
    const cfg = getEstadoUsuarioConfig(estado);
    return (
        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${cfg.className}`}>
            {cfg.label}
        </span>
    );
};
