import { useCallback, useState } from "react";

const asegurarBlobPdf = (blob) => {
    if (blob.type?.includes("pdf")) return blob;
    return new Blob([blob], { type: "application/pdf" });
};

export const useArchivoPdfViewer = () => {
    const [visor, setVisor] = useState(null);

    const cerrarVisor = useCallback(() => {
        setVisor((prev) => {
            if (prev?.url) URL.revokeObjectURL(prev.url);
            return null;
        });
    }, []);

    const abrirPdf = useCallback((blob, titulo) => {
        setVisor((prev) => {
            if (prev?.url) URL.revokeObjectURL(prev.url);
            const pdfBlob = asegurarBlobPdf(blob);
            return {
                url: URL.createObjectURL(pdfBlob),
                titulo: titulo ?? "Documento PDF",
            };
        });
    }, []);

    return { visor, abrirPdf, cerrarVisor };
};
