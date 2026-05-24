import { useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { SectionCard } from "../../../components/ui/SectionCard";

export const ArchivoSection = ({ archivo, onArchivoChange, onRemove }) => {
    const fileInputRef = useRef(null);

    return (
        <SectionCard
            icon={Upload}
            title="Archivo adjunto (opcional)"
            accent="text-gray-500 bg-gray-50 dark:bg-gray-700/30"
        >
            {archivo ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg
                    bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    <FileText size={18} className="text-[#EC7A21] shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                            {archivo.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {(archivo.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-gray-400 hover:text-red-500 transition shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex flex-col items-center gap-2 px-4 py-8 rounded-lg
                        border-2 border-dashed border-gray-200 dark:border-gray-600
                        hover:border-[#EFB357] dark:hover:border-[#EFB357]
                        text-gray-400 hover:text-[#EC7A21] transition cursor-pointer"
                >
                    <Upload size={22} />
                    <span className="text-sm">Haz clic para adjuntar un archivo</span>
                    <span className="text-xs opacity-70">PDF, DOC, DOCX, XLSX — máx. 20 MB</span>
                </button>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xlsx,.ppt,.pptx"
                onChange={onArchivoChange}
                className="hidden"
            />
        </SectionCard>
    );
};
