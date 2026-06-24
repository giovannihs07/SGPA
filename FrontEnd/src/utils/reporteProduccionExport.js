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
    filasFiltrosReporteAdmin,
} from "../pages/admin/adminReportesHelpers";
import { filasConteoExcel, bodyConteoPdf } from "./reporteConteoExport";

const fechaArchivo = () => new Date().toISOString().slice(0, 10);

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

const hojaFiltrosExcel = (filtrosLabel) =>
    XLSX.utils.json_to_sheet([
        { Filtro: "Estado", Valor: filtrosLabel.estado },
        { Filtro: "Categoría", Valor: filtrosLabel.categoria },
        { Filtro: "Subcategoría", Valor: filtrosLabel.subcategoria },
        { Filtro: "Tipo de producto", Valor: filtrosLabel.tipo },
        { Filtro: "Facultad", Valor: filtrosLabel.facultad },
        { Filtro: "Programa", Valor: filtrosLabel.programa },
        { Filtro: "Rango de fechas", Valor: filtrosLabel.fecha },
        { Filtro: "Búsqueda", Valor: filtrosLabel.busqueda },
    ]);

const encabezadoPdf = (doc, { titulo, generadoEn }) => {
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(titulo, 14, 16);
    doc.setFontSize(9);
    doc.setTextColor(100);
    const generado = generadoEn
        ? new Date(generadoEn).toLocaleString("es-CO")
        : new Date().toLocaleString("es-CO");
    doc.text(`Generado: ${generado}`, 14, 22);
};

const tablaFiltrosPdf = (doc, filtrosLabel, startY = 27) => {
    autoTable(doc, {
        startY,
        head: [["Filtro", "Valor"]],
        body: filasFiltrosReporteAdmin(filtrosLabel),
        theme: "grid",
        headStyles: { fillColor: [100, 100, 100] },
        styles: { fontSize: 8 },
    });
};

const bodyProductosPdf = (productos) =>
    (productos ?? []).map((p) => [
        p.id,
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
    ]);

const bodyRankingPdf = (ranking) =>
    (ranking ?? []).map((d, i) => [
        i + 1,
        d.nombre,
        d.codigo,
        d.facultades ?? "—",
        d.programas ?? "—",
        d.total,
        d.publicados,
        d.sinPublicar,
        d.recientes,
    ]);

/** Reporte ejecutivo — sin listados masivos. */
export const exportarReporteEjecutivoExcel = ({
    resumen,
    filtrosEtiquetas,
    cobertura,
    porFacultad = [],
    porPrograma = [],
    graficos,
}) => {
    const wb = XLSX.utils.book_new();
    const filtrosLabel = filtrosEtiquetas ?? {};
    const porCategoria = graficos?.porCategoria ?? [];
    const porSubcategoria = graficos?.porSubcategoria ?? [];
    const labelCategoria = (k) => CATEGORIA_LABELS[k] ?? k;
    const labelSubcategoria = (k) => SUBCATEGORIA_LABELS[k] ?? k;

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
        { Métrica: "Tipo filtro", Valor: filtrosLabel.tipo },
        { Métrica: "Facultad filtro", Valor: filtrosLabel.facultad },
        { Métrica: "Programa filtro", Valor: filtrosLabel.programa },
        { Métrica: "Rango de fechas", Valor: filtrosLabel.fecha },
        { Métrica: "Búsqueda", Valor: filtrosLabel.busqueda },
    ]);
    XLSX.utils.book_append_sheet(wb, hojaResumen, "Resumen");

    if (cobertura) {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filasCobertura(cobertura)), "Cobertura");
    }
    if (porFacultad.length > 0) {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filasFacultad(porFacultad)), "Por facultad");
    }
    if (porPrograma.length > 0) {
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filasPrograma(porPrograma)), "Por programa");
    }
    if (porCategoria.length > 0) {
        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(filasConteoExcel(porCategoria, labelCategoria, resumen.total)),
            "Por categoría",
        );
    }
    if (porSubcategoria.length > 0) {
        XLSX.utils.book_append_sheet(
            wb,
            XLSX.utils.json_to_sheet(filasConteoExcel(porSubcategoria, labelSubcategoria, resumen.total)),
            "Por subcategoría",
        );
    }

    XLSX.writeFile(wb, `reporte-ejecutivo-produccion-${fechaArchivo()}.xlsx`);
};

export const exportarReporteEjecutivoPdf = ({
    resumen,
    filtrosEtiquetas,
    cobertura,
    porFacultad = [],
    porPrograma = [],
    meta,
    graficos,
}) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const filtrosLabel = filtrosEtiquetas ?? {};
    const porCategoria = graficos?.porCategoria ?? [];
    const porSubcategoria = graficos?.porSubcategoria ?? [];
    const labelCategoria = (k) => CATEGORIA_LABELS[k] ?? k;
    const labelSubcategoria = (k) => SUBCATEGORIA_LABELS[k] ?? k;

    encabezadoPdf(doc, {
        titulo: meta?.titulo ?? "Reporte ejecutivo — producción docente SGPA",
        generadoEn: meta?.generadoEn,
    });

    tablaFiltrosPdf(doc, filtrosLabel);

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

    if (porCategoria.length > 0) {
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 8,
            head: [["Categoría", "Total productos", "% del total"]],
            body: bodyConteoPdf(porCategoria, labelCategoria, resumen.total),
            theme: "grid",
            headStyles: { fillColor: [236, 122, 33] },
            styles: { fontSize: 7 },
        });
    }

    if (porSubcategoria.length > 0) {
        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 8,
            head: [["Subcategoría", "Total productos", "% del total"]],
            body: bodyConteoPdf(porSubcategoria, labelSubcategoria, resumen.total),
            theme: "grid",
            headStyles: { fillColor: [236, 122, 33] },
            styles: { fontSize: 7 },
        });
    }

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

    doc.save(`reporte-ejecutivo-produccion-${fechaArchivo()}.pdf`);
};

/** Inventario de productos — Excel y PDF. */
export const exportarReporteProductosExcel = (reporte) => {
    const wb = XLSX.utils.book_new();
    const filtrosLabel = reporte.filtrosEtiquetas ?? {};

    XLSX.utils.book_append_sheet(wb, hojaFiltrosExcel(filtrosLabel), "Filtros");
    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([
            { Métrica: "Total productos", Valor: reporte.total ?? reporte.productos?.length ?? 0 },
        ]),
        "Resumen",
    );
    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(filasProductos(reporte.productos ?? [])),
        "Productos",
    );

    XLSX.writeFile(wb, `reporte-productos-${fechaArchivo()}.xlsx`);
};

export const exportarReporteProductosPdf = (reporte) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const filtrosLabel = reporte.filtrosEtiquetas ?? {};
    const productos = reporte.productos ?? [];
    const total = reporte.total ?? productos.length;

    encabezadoPdf(doc, {
        titulo: reporte.meta?.titulo ?? "Inventario de productos — SGPA",
        generadoEn: reporte.meta?.generadoEn,
    });

    tablaFiltrosPdf(doc, filtrosLabel);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 6,
        head: [["Métrica", "Valor"]],
        body: [["Total productos", total]],
        theme: "grid",
        headStyles: { fillColor: [236, 122, 33] },
        styles: { fontSize: 8 },
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [[
            "ID", "Producto", "Docente", "Facultad", "Programa",
            "Categoría", "Subcategoría", "Tipo", "Estado", "Registro SGPA", "Publicado SGPA",
        ]],
        body: bodyProductosPdf(productos),
        theme: "striped",
        headStyles: { fillColor: [236, 122, 33] },
        styles: { fontSize: 6, cellWidth: "wrap" },
    });

    doc.save(`reporte-productos-${fechaArchivo()}.pdf`);
};

/** Ranking de docentes — Excel y PDF. */
export const exportarReporteDocentesExcel = (reporte) => {
    const wb = XLSX.utils.book_new();
    const filtrosLabel = reporte.filtrosEtiquetas ?? {};

    XLSX.utils.book_append_sheet(wb, hojaFiltrosExcel(filtrosLabel), "Filtros");
    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet([
            { Métrica: "Docentes en ranking", Valor: reporte.total ?? reporte.rankingDocentes?.length ?? 0 },
        ]),
        "Resumen",
    );
    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(filasRanking(reporte.rankingDocentes ?? [])),
        "Ranking docentes",
    );

    XLSX.writeFile(wb, `reporte-docentes-${fechaArchivo()}.xlsx`);
};

export const exportarReporteDocentesPdf = (reporte) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const filtrosLabel = reporte.filtrosEtiquetas ?? {};
    const ranking = reporte.rankingDocentes ?? [];
    const total = reporte.total ?? ranking.length;

    encabezadoPdf(doc, {
        titulo: reporte.meta?.titulo ?? "Ranking de docentes — SGPA",
        generadoEn: reporte.meta?.generadoEn,
    });

    tablaFiltrosPdf(doc, filtrosLabel);

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 6,
        head: [["Métrica", "Valor"]],
        body: [["Docentes en ranking", total]],
        theme: "grid",
        headStyles: { fillColor: [236, 122, 33] },
        styles: { fontSize: 8 },
    });

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [[
            "#", "Docente", "Código", "Facultad", "Programa",
            "Total", "Publicados", "Sin publicar", "Nuevos (30 d)",
        ]],
        body: bodyRankingPdf(ranking),
        theme: "striped",
        headStyles: { fillColor: [236, 122, 33] },
        styles: { fontSize: 7, cellWidth: "wrap" },
    });

    doc.save(`reporte-docentes-${fechaArchivo()}.pdf`);
};
