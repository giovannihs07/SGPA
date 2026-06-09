import { FOOTER } from "./footerConfig";
import { text } from "../ui/themeTokens";

const currentYear = new Date().getFullYear();

export const Footer = () => (
    <footer
        role="contentinfo"
        className="shrink-0 border-t border-gray-200 dark:border-gray-600
            bg-white dark:bg-gray-800 px-4 sm:px-6 py-3"
    >
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <p className={`text-xs text-center sm:text-left ${text.muted}`}>
                <span className="font-semibold text-[#EC7A21]">{FOOTER.appName}</span>
                {" · "}
                {FOOTER.institution}
                <span className="hidden sm:inline"> · </span>
                <span className="block sm:inline mt-0.5 sm:mt-0">
                    © {currentYear}
                </span>
            </p>

            <p className={`text-xs text-center sm:text-right shrink-0 ${text.muted}`}>
                v{FOOTER.version}
            </p>
        </div>
    </footer>
);
