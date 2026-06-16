import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const AuthBackToPublicLink = ({ className = "" }) => (
    <p className={`text-center text-sm text-gray-500 mt-4 ${className}`.trim()}>
        <Link
            to="/portal/public"
            className="inline-flex items-center justify-center gap-1.5 text-gray-500
                hover:text-[#EC7A21] font-medium transition"
        >
            <ArrowLeft size={14} aria-hidden="true" />
            Volver al portal público
        </Link>
    </p>
);
