/**
 * Label de campo de formulario con indicador de requerido.
 */
export const Label = ({ children, required }) => (
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
        {children}
        {required && <span className="text-[#EC7A21] ml-0.5">*</span>}
    </label>
);
 
