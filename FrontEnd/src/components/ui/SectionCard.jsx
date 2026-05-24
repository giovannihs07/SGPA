/**
 * Tarjeta de sección con encabezado coloreado e icono.
 * Usada en formularios de registro de productos y otros.
 */
export const SectionCard = ({ icon: Icon, title, accent, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 dark:border-gray-700 ${accent}`}>
            <Icon size={15} className="shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        </div>
        <div className="p-5 space-y-4">{children}</div>
    </div>
)
