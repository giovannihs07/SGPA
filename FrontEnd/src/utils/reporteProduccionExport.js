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
    nombreDocente,
    etiquetasFiltrosActivos,
    filasFiltrosReporteAdmin,
} from "../pages/admin/adminReportesHelpers";

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
        "Registrado en SGPA": formatFecha(p.fechaRegistroSgpa),
        "Publicado en SGPA": formatFecha(p.fechaPublicacionSgpa),
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

const filasFacultad = (filas) =>
    filas.map((f) => ({
        Facultad: f.nombre,
        Código: f.codigo,
        Productos: f.total,
        Publicados: f.publicados,
        "Sin publicar": f.sinPublicar,
        "Doc. con producción": f.docentesConProduccion,
        "Doc. total": f.totalDocentes,
        "Cobertura %": f.porcentajeCobertura,
    }));

const filasPrograma = (filas) =>
    filas.map((p) => ({
        Programa: p.nombre,
        Facultad: p.facultadNombre,
        Código: p.codigo,
        Nivel: p.nivel,
        Productos: p.total,
        Publicados: p.publicados,
        "Sin publicar": p.sinPublicar,
        "Doc. con producción": p.docentesConProduccion,
        "Doc. total": p.totalDocentes,
        "Cobertura %": p.porcentajeCobertura,
    }));

const filasCobertura = (cobertura) => [
    { Métrica: "Docentes en alcance", Valor: cobertura.totalDocentes },
    { Métrica: "Docentes con producción", Valor: cobertura.docentesConProduccion },
    { Métrica: "Docentes sin producción", Valor: cobertura.docentesSinProduccion },
    { Métrica: "Cobertura docente (%)", Valor: cobertura.porcentajeCobertura },
];

export const exportarReporteExcel = ({
    productos,
    resumen,
    rankingDocentes,
    filtros,
    facultades,
    programas,
    cobertura,
    porFacultad = [],
    porPrograma = [],
}) => {
    const wb = XLSX.utils.book_new();
    const labels = { categoria: CATEGORIA_LABELS, subcategoria: SUBCATEGORIA_LABELS };
    const filtrosLabel = etiquetasFiltrosActivos(filtros, { facultades, programas, labels });

    const hojaResumen = XLSX.utils.json_to_sheet([
        { Métrica: "Total productos", Valor: resumen.total },
        { Métrica: "Publicados", Valor: resumen.publicados },
        { Métrica: "Sin publicar", Valor: resumen.sinPublicar },
        { Métrica: "Docentes con producción", Valor: resumen.docentesActivos },
        { Métrica: "Docentes en alcance", Valor: cobertura?.totalDocentes ?? "—" },
        { Métrica: "Docentes sin producción", Valor: cobertura?.docentesSinProduccion ?? "—" },
        { Métrica: "Cobertura docente (%)", Valor: cobertura?.porcentajeCobertura ?? "—" },
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

    if (cobertura) {
        const hojaCobertura = XLSX.utils.json_to_sheet(filasCobertura(cobertura));
        XLSX.utils.book_append_sheet(wb, hojaCobertura, "Cobertura");
    }

    if (porFacultad.length > 0) {
        const hojaFacultad = XLSX.utils.json_to_sheet(filasFacultad(porFacultad));
        XLSX.utils.book_append_sheet(wb, hojaFacultad, "Por facultad");
    }

    if (porPrograma.length > 0) {
        const hojaPrograma = XLSX.utils.json_to_sheet(filasPrograma(porPrograma));
        XLSX.utils.book_append_sheet(wb, hojaPrograma, "Por programa");
    }

    const hojaProductos = XLSX.utils.json_to_sheet(filasProductos(productos));
    XLSX.utils.book_append_sheet(wb, hojaProductos, "Productos");

    const hojaRanking = XLSX.utils.json_to_sheet(filasRanking(rankingDocentes));
    XLSX.utils.book_append_sheet(wb, hojaRanking, "Ranking docentes");

    XLSX.writeFile(wb, `reporte-acreditacion-produccion-${fechaArchivo()}.xlsx`);
};

export const exportarReportePdf = ({
    productos,
    resumen,
    rankingDocentes,
    filtros,
    facultades,
    programas,
    cobertura,
    porFacultad = [],
    porPrograma = [],
}) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const labels = { categoria: CATEGORIA_LABELS, subcategoria: SUBCATEGORIA_LABELS };
    const filtrosLabel = etiquetasFiltrosActivos(filtros, { facultades, programas, labels });

    doc.setFontSize(14);
    doc.text("Reporte de acreditación — producción docente SGPA", 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generado: ${new Date().toLocaleString("es-CO")}`, 14, 22);

    autoTable(doc, {
        startY: 27,
        head: [["Filtro", "Valor"]],
        body: filasFiltrosReporteAdmin(filtrosLabel),
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
            ["Docentes con producción", resumen.docentesActivos],
            ["Docentes en alcance", cobertura?.totalDocentes ?? "—"],
            ["Docentes sin producción", cobertura?.docentesSinProduccion ?? "—"],
            ["Cobertura docente (%)", cobertura?.porcentajeCobertura ?? "—"],
            ["Nuevos (30 días)", resumen.recientes],
        ],
        theme: "grid",
        headStyles: { fillColor: [236, 122, 33] },
        styles: { fontSize: 8 },
    });

    if (porFacultad.length > 0) {
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 8,
            head: [["Facultad", "Productos", "Publicados", "Doc. con prod.", "Doc. total", "Cobertura %"]],
            body: porFacultad.map((f) => [
                f.nombre,
                f.total,
                f.publicados,
                f.docentesConProduccion,
                f.totalDocentes,
                `${f.porcentajeCobertura}%`,
            ]),
            theme: "grid",
            headStyles: { fillColor: [236, 122, 33] },
            styles: { fontSize: 7 },
        });
    }

    if (porPrograma.length > 0) {
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 8,
            head: [["Programa", "Facultad", "Productos", "Publicados", "Doc. con prod.", "Doc. total", "Cobertura %"]],
            body: porPrograma.slice(0, 20).map((p) => [
                p.nombre,
                p.facultadNombre,
                p.total,
                p.publicados,
                p.docentesConProduccion,
                p.totalDocentes,
                `${p.porcentajeCobertura}%`,
            ]),
            theme: "grid",
            headStyles: { fillColor: [236, 122, 33] },
            styles: { fontSize: 7 },
        });
    }

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [["Producto", "Docente", "Facultad", "Programa", "Categoría", "Subcategoría", "Tipo", "Estado", "Registro SGPA", "Publicado en SGPA"]],
        body: productos.map((p) => [
            p.nombre ?? "—",
            nombreDocente(p),
            p.facultadesLabel ?? "—",
            p.programasLabel ?? "—",
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

    doc.save(`reporte-acreditacion-produccion-${fechaArchivo()}.pdf`);
};
