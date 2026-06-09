import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { filasResumenSistema } from "../pages/superAdmin/superAdminReportesHelpers";

const fechaArchivo = () => new Date().toISOString().slice(0, 10);

export const exportarReporteSistemaExcel = ({
    resumenUsuarios,
    resumenProduccion,
    cobertura,
    auditoria,
    usuariosPorRol,
    usuariosPorEstado,
}) => {
    const wb = XLSX.utils.book_new();

    const hojaResumen = XLSX.utils.json_to_sheet(filasResumenSistema({
        resumenUsuarios,
        resumenProduccion,
        cobertura,
        auditoria,
    }));
    XLSX.utils.book_append_sheet(wb, hojaResumen, "Resumen");

    const hojaUsuarios = XLSX.utils.json_to_sheet([
        ...usuariosPorRol.map((r) => ({ Tipo: "Rol", Etiqueta: r.label, Cantidad: r.count })),
        ...usuariosPorEstado.map((e) => ({ Tipo: "Estado", Etiqueta: e.label, Cantidad: e.count })),
    ]);
    XLSX.utils.book_append_sheet(wb, hojaUsuarios, "Usuarios");

    XLSX.writeFile(wb, `reporte-sistema-sgpa-${fechaArchivo()}.xlsx`);
};

export const exportarReporteSistemaPdf = ({
    resumenUsuarios,
    resumenProduccion,
    cobertura,
    auditoria,
    usuariosPorRol,
}) => {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFontSize(14);
    doc.text("Reporte del sistema — SGPA", 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generado: ${new Date().toLocaleString("es-CO")}`, 14, 22);

    autoTable(doc, {
        startY: 28,
        head: [["Métrica", "Valor"]],
        body: filasResumenSistema({
            resumenUsuarios,
            resumenProduccion,
            cobertura,
            auditoria,
        }).map((f) => [f.Métrica, f.Valor]),
        theme: "grid",
        headStyles: { fillColor: [236, 122, 33] },
        styles: { fontSize: 8 },
    });

    if (usuariosPorRol.length > 0) {
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 8,
            head: [["Rol", "Usuarios"]],
            body: usuariosPorRol.map((r) => [r.label, r.count]),
            theme: "grid",
            headStyles: { fillColor: [100, 100, 100] },
            styles: { fontSize: 8 },
        });
    }

    doc.save(`reporte-sistema-sgpa-${fechaArchivo()}.pdf`);
};
