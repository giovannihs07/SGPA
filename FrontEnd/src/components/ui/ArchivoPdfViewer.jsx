import { useEffect } from "react";
import { X } from "lucide-react";

export const ArchivoPdfViewer = ({ url, titulo, onClose }) => {
    useEffect(() => {
        if (!url) return undefined;

        const onKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [url, onClose]);

    if (!url) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdf-viewer-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
                aria-label="Cerrar visor"
            />

            <div className="relative z-10 m-2 sm:m-4 flex flex-col flex-1 min-h-0
                rounded-xl overflow-hidden shadow-2xl bg-white dark:bg-gray-900">
                <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3
                    bg-[#222222] text-white">
                    <h3
                        id="pdf-viewer-title"
                        className="text-sm font-semibold truncate min-w-0"
                        title={titulo}
                    >
                        {titulo}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0
                            text-white/80 hover:bg-white/10 hover:text-white transition"
                        aria-label="Cerrar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <iframe
                    src={url}
                    title={titulo}
                    className="flex-1 w-full min-h-0 bg-white border-0"
                />
            </div>
        </div>
    );
};
