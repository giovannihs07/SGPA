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
import { filasConteoExcel, bodyConteoPdf } from "./reporteConteoExport";
import {
    agregarHoja,
    escribirLibro,
    estiloTabla,
    fechaArchivo,
    finalizarPdf,
    hojaClaveValor,
    hojaTabla,
    iniciarPdf,
    nuevoLibro,
    siguienteY,
} from "./reportePlantilla";

const LABELS = { categoria: CATEGORIA_LABELS, subcategoria: SUBCATEGORIA_LABELS, tipo: TIPO_LABELS };
const labelCategoria = (k) => CATEGORIA_LABELS[k] ?? k;
const labelSubcategoria = (k) => SUBCATEGORIA_LABELS[k] ?? k;

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

const filasMetricas = (resumen) => [
    ["Total productos", resumen.total],
    ["Publicados", resumen.publicados],
    ["Sin publicar", resumen.sinPublicar],
    ["Nuevos (30 días)", resumen.recientes],
];

const subtituloDocente = (docente) =>
    `Docente: ${nombreDocentePerfil(docente)} · Código: ${docente?.codigoDocente ?? "—"}`;

export const exportarMiReporteExcel = ({
    productos,
    resumen,
    docente,
    filtros,
    porCategoria = [],
    porSubcategoria = [],
}) => {
    const wb = nuevoLibro();
    const filtrosLabel = etiquetasFiltrosDocente(filtros, LABELS);

    agregarHoja(wb, hojaClaveValor([
        ["Docente", nombreDocentePerfil(docente)],
        ["Código docente", docente?.codigoDocente ?? "—"],
        ...filasMetricas(resumen),
    ], { titulo: "Mi producción académica" }), "Resumen");

    agregarHoja(wb, hojaClaveValor(filasFiltrosReporteDocente(filtrosLabel), {
        titulo: "Filtros aplicados",
        encabezados: ["Filtro", "Valor"],
    }), "Filtros");

    if (porCategoria.length > 0) {
        agregarHoja(wb, hojaTabla(filasConteoExcel(porCategoria, labelCategoria, resumen.total), {
            titulo: "Producción por categoría",
        }), "Por categoría");
    }

    if (porSubcategoria.length > 0) {
        agregarHoja(wb, hojaTabla(filasConteoExcel(porSubcategoria, labelSubcategoria, resumen.total), {
            titulo: "Producción por subcategoría",
        }), "Por subcategoría");
    }

    agregarHoja(wb, hojaTabla(filasProductos(productos), { titulo: "Mis productos" }), "Mis productos");

    const slug = docente?.codigoDocente ?? "docente";
    escribirLibro(wb, `mi-produccion-${slug}-${fechaArchivo()}.xlsx`);
};

export const exportarMiReportePdf = async ({
    productos,
    resumen,
    docente,
    filtros,
    porCategoria = [],
    porSubcategoria = [],
}) => {
    const filtrosLabel = etiquetasFiltrosDocente(filtros, LABELS);

    const { doc, startY } = await iniciarPdf({
        titulo: "Mi producción académica — SGPA",
        subtitulo: subtituloDocente(docente),
    });

    autoTable(doc, {
        ...estiloTabla("filtros"),
        startY,
        head: [["Filtro", "Valor"]],
        body: filasFiltrosReporteDocente(filtrosLabel),
    });

    autoTable(doc, {
        ...estiloTabla(),
        startY: siguienteY(doc, 6),
        head: [["Métrica", "Valor"]],
        body: filasMetricas(resumen),
    });

    if (porCategoria.length > 0) {
        autoTable(doc, {
            ...estiloTabla(),
            startY: siguienteY(doc),
            head: [["Categoría", "Total productos", "% del total"]],
            body: bodyConteoPdf(porCategoria, labelCategoria, resumen.total),
        });
    }

    if (porSubcategoria.length > 0) {
        autoTable(doc, {
            ...estiloTabla(),
            startY: siguienteY(doc),
            head: [["Subcategoría", "Total productos", "% del total"]],
            body: bodyConteoPdf(porSubcategoria, labelSubcategoria, resumen.total),
        });
    }

    autoTable(doc, {
        ...estiloTabla("detalle"),
        startY: siguienteY(doc),
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
        columnStyles: { 0: { cellWidth: 80 } },
    });

    const slug = docente?.codigoDocente ?? "docente";
    finalizarPdf(doc, { nombreArchivo: `mi-produccion-${slug}-${fechaArchivo()}.pdf` });
};
