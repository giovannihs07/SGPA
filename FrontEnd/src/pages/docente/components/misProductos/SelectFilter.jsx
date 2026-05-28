import { ChevronDown } from "lucide-react";
import { selectXs, inputIcon } from "../../../../components/ui/themeTokens";

export const SelectFilter = ({ value, onChange, children, icon: Icon, "aria-label": ariaLabel }) => (
    <div className="relative">
        {Icon && <Icon size={13} className={`${inputIcon} left-3`} aria-hidden="true" />}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={ariaLabel}
            className={`${selectXs} pr-7 ${Icon ? "pl-8" : "pl-3"}`}
        >
            {children}
        </select>
        <ChevronDown
            size={12}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
            aria-hidden="true"
        />
    </div>
);
