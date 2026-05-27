import { getEstadoConfig } from "../productoHelpers";

export const EstadoBadge = ({ publicado }) => {
    const cfg = getEstadoConfig(publicado);
    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5
            rounded-full text-xs font-semibold whitespace-nowrap ${cfg.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};
