import autoTable from "jspdf-autotable";
import { filasResumenSistema } from "../pages/superAdmin/superAdminReportesHelpers";
import {
    agregarHoja,
    escribirLibro,
    estiloTabla,
    fechaArchivo,
    finalizarPdf,
    hojaTabla,
    iniciarPdf,
    nuevoLibro,
    siguienteY,
} from "./reportePlantilla";

export const exportarReporteSistemaExcel = ({
    resumenUsuarios,
    resumenProduccion,
    cobertura,
    auditoria,
    usuariosPorRol,
    usuariosPorEstado,
}) => {
    const wb = nuevoLibro();

    agregarHoja(wb, hojaTabla(filasResumenSistema({
        resumenUsuarios,
        resumenProduccion,
        cobertura,
        auditoria,
    }), { titulo: "Reporte del sistema", autofiltro: false }), "Resumen");

    agregarHoja(wb, hojaTabla([
        ...usuariosPorRol.map((r) => ({ Tipo: "Rol", Etiqueta: r.label, Cantidad: r.count })),
        ...usuariosPorEstado.map((e) => ({ Tipo: "Estado", Etiqueta: e.label, Cantidad: e.count })),
    ], { titulo: "Usuarios por rol y estado" }), "Usuarios");

    escribirLibro(wb, `reporte-sistema-sgpa-${fechaArchivo()}.xlsx`);
};

export const exportarReporteSistemaPdf = async ({
    resumenUsuarios,
    resumenProduccion,
    cobertura,
    auditoria,
    usuariosPorRol,
}) => {
    const { doc, startY } = await iniciarPdf({
        titulo: "Reporte del sistema — SGPA",
        orientation: "portrait",
    });

    autoTable(doc, {
        ...estiloTabla(),
        startY,
        head: [["Métrica", "Valor"]],
        body: filasResumenSistema({
            resumenUsuarios,
            resumenProduccion,
            cobertura,
            auditoria,
        }).map((f) => [f.Métrica, f.Valor]),
    });

    if (usuariosPorRol.length > 0) {
        autoTable(doc, {
            ...estiloTabla(),
            startY: siguienteY(doc),
            head: [["Rol", "Usuarios"]],
            body: usuariosPorRol.map((r) => [r.label, r.count]),
        });
    }

    finalizarPdf(doc, { nombreArchivo: `reporte-sistema-sgpa-${fechaArchivo()}.pdf` });
};
