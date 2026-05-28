import { card, cardHeaderBorder } from "./themeTokens";

/**
 * Tarjeta de sección con encabezado coloreado e icono.
 * Usada en formularios de registro de productos y otros.
 */
export const SectionCard = ({ icon: Icon, title, accent, children }) => (
    <div className={card}>
        <div className={`flex items-center gap-2.5 px-5 py-3.5 ${cardHeaderBorder} ${accent}`}>
            <Icon size={15} className="shrink-0" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        </div>
        <div className="p-5 space-y-4">{children}</div>
    </div>
);
