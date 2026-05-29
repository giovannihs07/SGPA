import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    CATEGORIA_LABELS,
    SUBCATEGORIA_LABELS,
    TIPO_LABELS,
    formatFecha,
} from "../pages/docente/components/productoHelpers";
import { nombreDocente, etiquetasFiltrosActivos } from "../pages/admin/adminReportesHelpers";

const fechaArchivo = () => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
};

const estadoLabel = (publicado) => (publicado ? "Publicado" : "Sin publicar");

const filasProductos = (productos) =>
    productos.map((p) => ({
        ID: p.id,
        Producto: p.nombre ?? "—",
        Docente: nombreDocente(p),
        "Cód. docente": p.docenteCodigo ?? "—",
        Facultad: p.facultadesLabel ?? "—",
        Programa: p.programasLabel ?? "—",
        Categoría: CATEGORIA_LABELS[p.categoria] ?? p.categoria ?? "—",
        Subcategoría: SUBCATEGORIA_LABELS[p.subcategoria] ?? p.subcategoria ?? "—",
        Tipo: TIPO_LABELS[p.tipo] ?? p.tipo ?? "—",
        Estado: estadoLabel(p.publicado),
        "Fecha creación": formatFecha(p.fechaCreacion),
        "Fecha publicación": formatFecha(p.fechaPublicacion),
    }));

const filasRanking = (ranking) =>
    ranking.map((d, i) => ({
        "#": i + 1,
        Docente: d.nombre,
        "Código": d.codigo,
        Facultad: d.facultades ?? "—",
        Programa: d.programas ?? "—",
        Total: d.total,
        Publicados: d.publicados,
        "Sin publicar": d.sinPublicar,
        "Nuevos (30 d)": d.recientes,
    }));

export const exportarReporteExcel = ({
    productos,
    resumen,
    rankingDocentes,
    filtros,
    facultades,
    programas,
}) => {
    const wb = XLSX.utils.book_new();
    const labels = { categoria: CATEGORIA_LABELS, subcategoria: SUBCATEGORIA_LABELS };
    const filtrosLabel = etiquetasFiltrosActivos(filtros, { facultades, programas, labels });

    const hojaResumen = XLSX.utils.json_to_sheet([
        { Métrica: "Total productos", Valor: resumen.total },
        { Métrica: "Publicados", Valor: resumen.publicados },
        { Métrica: "Sin publicar", Valor: resumen.sinPublicar },
        { Métrica: "Docentes con producción", Valor: resumen.docentesActivos },
        { Métrica: "Nuevos (30 días)", Valor: resumen.recientes },
        { Métrica: "Estado filtro", Valor: filtrosLabel.estado },
        { Métrica: "Categoría filtro", Valor: filtrosLabel.categoria },
        { Métrica: "Subcategoría filtro", Valor: filtrosLabel.subcategoria },
        { Métrica: "Facultad filtro", Valor: filtrosLabel.facultad },
        { Métrica: "Programa filtro", Valor: filtrosLabel.programa },
        { Métrica: "Rango de fechas", Valor: filtrosLabel.fecha },
        { Métrica: "Búsqueda", Valor: filtrosLabel.busqueda },
    ]);
    XLSX.utils.book_append_sheet(wb, hojaResumen, "Resumen");

    const hojaProductos = XLSX.utils.json_to_sheet(filasProductos(productos));
    XLSX.utils.book_append_sheet(wb, hojaProductos, "Productos");

    const hojaRanking = XLSX.utils.json_to_sheet(filasRanking(rankingDocentes));
    XLSX.utils.book_append_sheet(wb, hojaRanking, "Ranking docentes");

    XLSX.writeFile(wb, `reporte-produccion-docente-${fechaArchivo()}.xlsx`);
};

export const exportarReportePdf = ({
    productos,
    resumen,
    rankingDocentes,
    filtros,
    facultades,
    programas,
}) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const labels = { categoria: CATEGORIA_LABELS, subcategoria: SUBCATEGORIA_LABELS };
    const filtrosLabel = etiquetasFiltrosActivos(filtros, { facultades, programas, labels });

    doc.setFontSize(14);
    doc.text("Reporte de producción docente — SGPA", 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generado: ${new Date().toLocaleString("es-CO")}`, 14, 22);
    doc.text(
        `Filtros: ${filtrosLabel.estado} · ${filtrosLabel.categoria} · ${filtrosLabel.subcategoria} · ${filtrosLabel.facultad} · ${filtrosLabel.programa} · ${filtrosLabel.fecha}`,
        14,
        27,
    );

    autoTable(doc, {
        startY: 32,
        head: [["Métrica", "Valor"]],
        body: [
            ["Total productos", resumen.total],
            ["Publicados", resumen.publicados],
            ["Sin publicar", resumen.sinPublicar],
            ["Docentes con producción", resumen.docentesActivos],
            ["Nuevos (30 días)", resumen.recientes],
        ],
        theme: "grid",
        headStyles: { fillColor: [236, 122, 33] },
        styles: { fontSize: 8 },
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [["Producto", "Docente", "Facultad", "Programa", "Categoría", "Subcategoría", "Tipo", "Estado", "Fecha"]],
        body: productos.map((p) => [
            p.nombre ?? "—",
            nombreDocente(p),
            p.facultadesLabel ?? "—",
            p.programasLabel ?? "—",
            CATEGORIA_LABELS[p.categoria] ?? p.categoria ?? "—",
            SUBCATEGORIA_LABELS[p.subcategoria] ?? p.subcategoria ?? "—",
            TIPO_LABELS[p.tipo] ?? p.tipo ?? "—",
            estadoLabel(p.publicado),
            formatFecha(p.fechaCreacion),
        ]),
        theme: "striped",
        headStyles: { fillColor: [236, 122, 33] },
        styles: { fontSize: 7, cellWidth: "wrap" },
    });

    if (rankingDocentes.length > 0) {
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 8,
            head: [["#", "Docente", "Facultad", "Total", "Publicados", "Sin publicar", "Nuevos (30 d)"]],
            body: rankingDocentes.slice(0, 15).map((d, i) => [
                i + 1,
                d.nombre,
                d.facultades ?? "—",
                d.total,
                d.publicados,
                d.sinPublicar,
                d.recientes,
            ]),
            theme: "grid",
            headStyles: { fillColor: [236, 122, 33] },
            styles: { fontSize: 7 },
        });
    }

    doc.save(`reporte-produccion-docente-${fechaArchivo()}.pdf`);
};
