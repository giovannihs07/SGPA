/** Agrupa campos del formulario de registro con título de sección. */
export const FormSection = ({ title, description, children }) => (
    <section className="space-y-3">
        <div className="border-b border-gray-100 pb-2">
            <h2 className="text-sm font-bold text-gray-800">{title}</h2>
            {description && (
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            )}
        </div>
        {children}
    </section>
);
