import { userTypeOptions } from "../registerConfig";
import { FieldError } from "../../../components/ui/FieldError";

const ICONS = {
    docente: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
    ),
    administrativo: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M12 1C8.676 1 6 3.676 6 7s2.676 6 6 6 6-2.676 6-6-2.676-6-6-6zm0 14c-4.006 0-12 2.009-12 6v2h24v-2c0-3.991-7.994-6-12-6z" />
        </svg>
    ),
};

const labelClass = "block text-xs font-bold text-gray-700 mb-1.5";

export const UserTypeSelector = ({ userTypes, onToggle, error }) => (
    <div role="group" aria-labelledby="user-type-label">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userTypeOptions.map((type) => {
                const checked = userTypes.includes(type.id);
                return (
                    <button
                        key={type.id}
                        type="button"
                        aria-pressed={checked}
                        onClick={() => onToggle(type.id)}
                        className={`relative p-3 rounded-md border-2 text-left transition shadow-[5px_2px_10px_3px_#0000000d] ${
                            checked ? "border-[#EFB357] bg-white" : "border-[#e0d3d3] bg-white"
                        } ${error ? "border-red-400" : ""}`}
                    >
                        <div className={`absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded border flex items-center justify-center transition ${
                            checked ? "bg-[#EFB357] border-[#EFB357]" : "border-gray-300 bg-white"
                        }`}>
                            {checked && <div className="w-1.5 h-1.5 rounded-sm bg-white" />}
                        </div>

                        <div className={`mt-3 mb-1 ${checked ? "text-[#EFB357]" : "text-gray-400"}`}>
                            {ICONS[type.id]}
                        </div>

                        <p className={`font-bold text-xs ${checked ? "text-gray-800" : "text-gray-500"}`}>
                            {type.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                            {type.description}
                        </p>
                    </button>
                );
            })}
        </div>
        <FieldError message={error} />
    </div>
);
