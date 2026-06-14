const GRADUATION_CAP_PATH =
    "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z";

export const SgpaBrandMark = ({ size = "default", showLabel = true, className = "" }) => {
    const boxClass = size === "large"
        ? "w-11 h-11 sm:w-12 sm:h-12"
        : "w-9 h-9 xl:w-10 xl:h-10";
    const iconClass = size === "large"
        ? "w-6 h-6 sm:w-7 sm:h-7"
        : "w-5 h-5 xl:w-6 xl:h-6";
    const labelClass = size === "large"
        ? "text-xs sm:text-sm"
        : "text-xs";

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className={`${boxClass} bg-[#ffc20e] rounded-md flex items-center justify-center shrink-0`}>
                <svg viewBox="0 0 24 24" className={`${iconClass} fill-white`} aria-hidden="true">
                    <path d={GRADUATION_CAP_PATH} />
                </svg>
            </div>
            {showLabel && (
                <span className={`text-[#ffc20e] font-bold ${labelClass} tracking-widest uppercase`}>
                    SGPA Unicartagena
                </span>
            )}
        </div>
    );
};
