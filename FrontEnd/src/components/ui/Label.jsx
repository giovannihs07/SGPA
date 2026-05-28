import { label } from "./themeTokens";

/**
 * Label de campo de formulario con indicador de requerido.
 */
export const Label = ({ children, required }) => (
    <label className={label}>
        {children}
        {required && <span className="text-[#EC7A21] ml-0.5" aria-hidden="true">*</span>}
    </label>
);
