import { ROLE_LABELS, normalizarRoles } from "../superAdminHelpers";

export const RolesBadge = ({ roles = [] }) => (
    <div className="flex flex-wrap gap-1">
        {normalizarRoles(roles).map((rol) => (
            <span
                key={rol}
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md
                    bg-[#ffc20e]/15 text-[#EC7A21] dark:bg-[#ffc20e]/10"
            >
                {ROLE_LABELS[rol] ?? rol}
            </span>
        ))}
    </div>
);
