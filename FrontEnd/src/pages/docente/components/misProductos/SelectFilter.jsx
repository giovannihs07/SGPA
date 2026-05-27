import { ChevronDown } from "lucide-react";

// Componente para el filtro de selección de estado, categoría y tipo de producto
export const SelectFilter = ({ value, onChange, children, icon: Icon }) => (
    <div className="relative">
        {/* Si hay icono, se muestra el icono */}
        {Icon && (
            <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        )}
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`appearance-none text-xs rounded-lg border border-gray-200 dark:border-gray-700
                bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-[#EFB357]/40
                focus:border-[#EFB357] transition cursor-pointer
                ${Icon ? "pl-8" : "pl-3"}`}
        >
            {children}
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
);
