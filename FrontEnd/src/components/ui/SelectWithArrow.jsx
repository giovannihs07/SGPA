import { selectSm, inputError } from "./themeTokens";

/**
 * Select estilizado con flecha decorativa.
 */
export const SelectWithArrow = ({
    name,
    value,
    onChange,
    options = [],
    placeholder,
    disabled = false,
    useObjectOptions = false,
    hasError = false,
}) => (
    <div className="relative">
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            className={`${selectSm} pr-10 ${hasError ? inputError : ""} ${
                disabled ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900" : ""
            }`}
        >
            <option value="" disabled>{placeholder}</option>
            {useObjectOptions
                ? options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))
                : options.map((o) => (
                    <option key={o} value={o}>{o}</option>
                ))
            }
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
);
