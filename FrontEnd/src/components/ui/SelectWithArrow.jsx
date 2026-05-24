const inputClass =
    "w-full px-3 py-2 rounded-md border-2 border-[#cab4b4] bg-white text-sm text-gray-800 " +
    "placeholder-gray-300 focus:outline-none focus:border-[#EFB357] transition shadow-[5px_2px_10px_3px_#0000000d]";

/**
 * Select estilizado con flecha decorativa.
 *
 * @param {string[]}                    options          - Array de strings, o…
 * @param {{ value, label }[]}          options          - Array de objetos si useObjectOptions=true
 * @param {boolean}                     useObjectOptions - Si true, options debe ser [{ value, label }]
 */
export const SelectWithArrow = ({
    name,
    value,
    onChange,
    options = [],
    placeholder,
    disabled = false,
    useObjectOptions = false,
}) => (
    <div className="relative">
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${inputClass} appearance-none pr-10 ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
        >
            <option value="" disabled>{placeholder}</option>
            {useObjectOptions
                ? options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))
                : options.map(o => (
                    <option key={o} value={o}>{o}</option>
                ))
            }
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
);
