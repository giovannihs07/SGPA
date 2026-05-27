import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const QuickLinkCard = ({ to, icon: Icon, title, description, badge }) => (
    <Link
        to={to}
        className="group flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl
            border border-gray-100 dark:border-gray-700 hover:border-[#ffc20e]/40
            hover:shadow-sm transition"
    >
        <div className="w-10 h-10 rounded-xl bg-[#ffc20e]/15 text-[#EC7A21]
            flex items-center justify-center shrink-0">
            <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{title}</p>
                {badge != null && badge > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full
                        bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        {badge}
                    </span>
                )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{description}</p>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-[#EC7A21] shrink-0" />
    </Link>
);
