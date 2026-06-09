import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    CATEGORIA_LABELS,
    SUBCATEGORIA_LABELS,
    TIPO_LABELS,
    formatFecha,
} from "../pages/docente/components/productoHelpers";
import {
    etiquetasFiltrosDocente,
    filasFiltrosReporteDocente,
    nombreDocentePerfil,
} from "../pages/docente/docenteReportesHelpers";

const fechaArchivo = () => new Date().toISOString().slice(0, 10);

const estadoLabel = (publicado) => (publicado ? "Publicado" : "Sin publicar");

const filasProductos = (productos) =>
    productos.map((p) => ({
        ID: p.id,
        Producto: p.nombre ?? "—",
        Categoría: CATEGORIA_LABELS[p.categoria] ?? p.categoria ?? "—",
        Subcategoría: SUBCATEGORIA_LABELS[p.subcategoria] ?? p.subcategoria ?? "—",
        Tipo: TIPO_LABELS[p.tipo] ?? p.tipo ?? "—",
        Estado: estadoLabel(p.publicado),
        "Registrado en SGPA": formatFecha(p.fechaRegistroSgpa),
        "Publicado en SGPA": formatFecha(p.fechaPublicacionSgpa),
    }));

export const exportarMiReporteExcel = ({ productos, resumen, docente, filtros }) => {
    const wb = XLSX.utils.book_new();
    const labels = { categoria: CATEGORIA_LABELS, subcategoria: SUBCATEGORIA_LABELS };
    const filtrosLabel = etiquetasFiltrosDocente(filtros, labels);
    const nombre = nombreDocentePerfil(docente);

    const hojaResumen = XLSX.utils.json_to_sheet([
        { Métrica: "Docente", Valor: nombre },
        { Métrica: "Código docente", Valor: docente?.codigoDocente ?? "—" },
        { Métrica: "Total productos", Valor: resumen.total },
        { Métrica: "Publicados", Valor: resumen.publicados },
        { Métrica: "Sin publicar", Valor: resumen.sinPublicar },
        { Métrica: "Nuevos (30 días)", Valor: resumen.recientes },
        { Métrica: "Estado filtro", Valor: filtrosLabel.estado },
        { Métrica: "Categoría filtro", Valor: filtrosLabel.categoria },
        { Métrica: "Subcategoría filtro", Valor: filtrosLabel.subcategoria },
        { Métrica: "Rango de fechas", Valor: filtrosLabel.fecha },
        { Métrica: "Búsqueda", Valor: filtrosLabel.busqueda },
    ]);
    XLSX.utils.book_append_sheet(wb, hojaResumen, "Resumen");

    const hojaProductos = XLSX.utils.json_to_sheet(filasProductos(productos));
    XLSX.utils.book_append_sheet(wb, hojaProductos, "Mis productos");

    const slug = docente?.codigoDocente ?? "docente";
    XLSX.writeFile(wb, `mi-produccion-${slug}-${fechaArchivo()}.xlsx`);
};

export const exportarMiReportePdf = ({ productos, resumen, docente, filtros }) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const labels = { categoria: CATEGORIA_LABELS, subcategoria: SUBCATEGORIA_LABELS };
    const filtrosLabel = etiquetasFiltrosDocente(filtros, labels);
    const nombre = nombreDocentePerfil(docente);

    doc.setFontSize(14);
    doc.text("Mi producción académica — SGPA", 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Docente: ${nombre} · Código: ${docente?.codigoDocente ?? "—"}`, 14, 22);
    doc.text(`Generado: ${new Date().toLocaleString("es-CO")}`, 14, 27);

    autoTable(doc, {
        startY: 32,
        head: [["Filtro", "Valor"]],
        body: filasFiltrosReporteDocente(filtrosLabel),
        theme: "grid",
        headStyles: { fillColor: [100, 100, 100] },
        styles: { fontSize: 8 },
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 6,
        head: [["Métrica", "Valor"]],
        body: [
            ["Total productos", resumen.total],
            ["Publicados", resumen.publicados],
            ["Sin publicar", resumen.sinPublicar],
            ["Nuevos (30 días)", resumen.recientes],
        ],
        theme: "grid",
        headStyles: { fillColor: [236, 122, 33] },
        styles: { fontSize: 8 },
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [["Producto", "Categoría", "Subcategoría", "Tipo", "Estado", "Registro SGPA", "Publicado en SGPA"]],
        body: productos.map((p) => [
            p.nombre ?? "—",
            CATEGORIA_LABELS[p.categoria] ?? p.categoria ?? "—",
            SUBCATEGORIA_LABELS[p.subcategoria] ?? p.subcategoria ?? "—",
            TIPO_LABELS[p.tipo] ?? p.tipo ?? "—",
            estadoLabel(p.publicado),
            formatFecha(p.fechaRegistroSgpa),
            formatFecha(p.fechaPublicacionSgpa),
        ]),
        theme: "striped",
        headStyles: { fillColor: [236, 122, 33] },
        styles: { fontSize: 7, cellWidth: "wrap" },
    });

    const slug = docente?.codigoDocente ?? "docente";
    doc.save(`mi-produccion-${slug}-${fechaArchivo()}.pdf`);
};
