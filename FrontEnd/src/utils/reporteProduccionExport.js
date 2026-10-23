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

/** El backend envía categoría/subcategoría/tipo como códigos; se traducen a etiquetas legibles. */
const etiquetarFiltros = (filtrosEtiquetas) => {
    const f = filtrosEtiquetas ?? {};
    return {
        ...f,
        categoria: CATEGORIA_LABELS[f.categoria] ?? f.categoria,
        subcategoria: SUBCATEGORIA_LABELS[f.subcategoria] ?? f.subcategoria,
        tipo: TIPO_LABELS[f.tipo] ?? f.tipo,
    };
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

const filasMetricasEjecutivo = (resumen, cobertura) => [
    ["Total productos", resumen.total],
    ["Publicados", resumen.publicados],
    ["Sin publicar", resumen.sinPublicar],
    ["Docentes con producción", resumen.docentesActivos],
    ["Docentes en alcance", cobertura?.totalDocentes ?? "—"],
    ["Docentes sin producción", cobertura?.docentesSinProduccion ?? "—"],
    ["Cobertura docente (%)", cobertura?.porcentajeCobertura ?? "—"],
    ["Nuevos (30 días)", resumen.recientes],
];

const hojaFiltrosExcel = (filtrosLabel) =>
    hojaClaveValor(filasFiltrosReporteAdmin(filtrosLabel), {
        titulo: "Filtros aplicados",
        encabezados: ["Filtro", "Valor"],
    });

const tablaFiltrosPdf = (doc, filtrosLabel, startY) => {
    autoTable(doc, {
        ...estiloTabla("filtros"),
        startY,
        head: [["Filtro", "Valor"]],
        body: filasFiltrosReporteAdmin(filtrosLabel),
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
    const wb = nuevoLibro();
    const filtrosLabel = etiquetarFiltros(filtrosEtiquetas);
    const porCategoria = graficos?.porCategoria ?? [];
    const porSubcategoria = graficos?.porSubcategoria ?? [];
    const labelCategoria = (k) => CATEGORIA_LABELS[k] ?? k;
    const labelSubcategoria = (k) => SUBCATEGORIA_LABELS[k] ?? k;

    agregarHoja(wb, hojaClaveValor(filasMetricasEjecutivo(resumen, cobertura), {
        titulo: "Reporte ejecutivo — producción docente",
    }), "Resumen");
    agregarHoja(wb, hojaFiltrosExcel(filtrosLabel), "Filtros");

    if (cobertura) {
        agregarHoja(wb, hojaTabla(filasCobertura(cobertura), {
            titulo: "Cobertura docente",
            autofiltro: false,
        }), "Cobertura");
    }
    if (porFacultad.length > 0) {
        agregarHoja(wb, hojaTabla(filasFacultad(porFacultad), { titulo: "Producción por facultad" }), "Por facultad");
    }
    if (porPrograma.length > 0) {
        agregarHoja(wb, hojaTabla(filasPrograma(porPrograma), { titulo: "Producción por programa" }), "Por programa");
    }
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

    escribirLibro(wb, `reporte-ejecutivo-produccion-${fechaArchivo()}.xlsx`);
};

export const exportarReporteEjecutivoPdf = async ({
    resumen,
    filtrosEtiquetas,
    cobertura,
    porFacultad = [],
    porPrograma = [],
    meta,
    graficos,
}) => {
    const filtrosLabel = etiquetarFiltros(filtrosEtiquetas);
    const porCategoria = graficos?.porCategoria ?? [];
    const porSubcategoria = graficos?.porSubcategoria ?? [];
    const labelCategoria = (k) => CATEGORIA_LABELS[k] ?? k;
    const labelSubcategoria = (k) => SUBCATEGORIA_LABELS[k] ?? k;

    const { doc, startY } = await iniciarPdf({
        titulo: meta?.titulo ?? "Reporte ejecutivo — producción docente SGPA",
        generadoEn: meta?.generadoEn,
    });

    tablaFiltrosPdf(doc, filtrosLabel, startY);

    autoTable(doc, {
        ...estiloTabla(),
        startY: siguienteY(doc, 6),
        head: [["Métrica", "Valor"]],
        body: filasMetricasEjecutivo(resumen, cobertura),
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

    if (porFacultad.length > 0) {
        autoTable(doc, {
            ...estiloTabla(),
            startY: siguienteY(doc),
            head: [["Facultad", "Productos", "Publicados", "Doc. con prod.", "Doc. total", "Cobertura %"]],
            body: porFacultad.map((f) => [
                f.nombre,
                f.total,
                f.publicados,
                f.docentesConProduccion,
                f.totalDocentes,
                `${f.porcentajeCobertura}%`,
            ]),
        });
    }

    if (porPrograma.length > 0) {
        autoTable(doc, {
            ...estiloTabla(),
            startY: siguienteY(doc),
            head: [["Programa", "Facultad", "Productos", "Publicados", "Doc. con prod.", "Doc. total", "Cobertura %"]],
            body: porPrograma.map((p) => [
                p.nombre,
                p.facultadNombre,
                p.total,
                p.publicados,
                p.docentesConProduccion,
                p.totalDocentes,
                `${p.porcentajeCobertura}%`,
            ]),
        });
    }

    finalizarPdf(doc, {
        nombreArchivo: `reporte-ejecutivo-produccion-${fechaArchivo()}.pdf`,
        nota: meta?.notaAtribucion,
    });
};

/** Inventario de productos — Excel y PDF. */
export const exportarReporteProductosExcel = (reporte) => {
    const wb = nuevoLibro();
    const filtrosLabel = etiquetarFiltros(reporte.filtrosEtiquetas);

    agregarHoja(wb, hojaTabla(filasProductos(reporte.productos ?? []), {
        titulo: `Inventario de productos (${reporte.total ?? reporte.productos?.length ?? 0})`,
    }), "Productos");
    agregarHoja(wb, hojaFiltrosExcel(filtrosLabel), "Filtros");

    escribirLibro(wb, `reporte-productos-${fechaArchivo()}.xlsx`);
};

export const exportarReporteProductosPdf = async (reporte) => {
    const filtrosLabel = etiquetarFiltros(reporte.filtrosEtiquetas);
    const productos = reporte.productos ?? [];
    const total = reporte.total ?? productos.length;

    const { doc, startY } = await iniciarPdf({
        titulo: reporte.meta?.titulo ?? "Inventario de productos — SGPA",
        subtitulo: `Total de productos: ${total}`,
        generadoEn: reporte.meta?.generadoEn,
    });

    tablaFiltrosPdf(doc, filtrosLabel, startY);

    autoTable(doc, {
        ...estiloTabla("detalle"),
        startY: siguienteY(doc),
        head: [[
            "ID", "Producto", "Docente", "Facultad", "Programa",
            "Categoría", "Subcategoría", "Tipo", "Estado", "Registro SGPA", "Publicado SGPA",
        ]],
        body: bodyProductosPdf(productos),
        columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 55 }, 2: { cellWidth: 30 } },
    });

    finalizarPdf(doc, {
        nombreArchivo: `reporte-productos-${fechaArchivo()}.pdf`,
        nota: reporte.meta?.notaAtribucion,
    });
};

/** Ranking de docentes — Excel y PDF. */
export const exportarReporteDocentesExcel = (reporte) => {
    const wb = nuevoLibro();
    const filtrosLabel = etiquetarFiltros(reporte.filtrosEtiquetas);

    agregarHoja(wb, hojaTabla(filasRanking(reporte.rankingDocentes ?? []), {
        titulo: `Ranking de docentes (${reporte.total ?? reporte.rankingDocentes?.length ?? 0})`,
    }), "Ranking docentes");
    agregarHoja(wb, hojaFiltrosExcel(filtrosLabel), "Filtros");

    escribirLibro(wb, `reporte-docentes-${fechaArchivo()}.xlsx`);
};

export const exportarReporteDocentesPdf = async (reporte) => {
    const filtrosLabel = etiquetarFiltros(reporte.filtrosEtiquetas);
    const ranking = reporte.rankingDocentes ?? [];
    const total = reporte.total ?? ranking.length;

    const { doc, startY } = await iniciarPdf({
        titulo: reporte.meta?.titulo ?? "Ranking de docentes — SGPA",
        subtitulo: `Docentes en ranking: ${total}`,
        generadoEn: reporte.meta?.generadoEn,
    });

    tablaFiltrosPdf(doc, filtrosLabel, startY);

    autoTable(doc, {
        ...estiloTabla("detalle"),
        startY: siguienteY(doc),
        head: [[
            "#", "Docente", "Código", "Facultad", "Programa",
            "Total", "Publicados", "Sin publicar", "Nuevos (30 d)",
        ]],
        body: bodyRankingPdf(ranking),
        columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 45 } },
    });

    finalizarPdf(doc, {
        nombreArchivo: `reporte-docentes-${fechaArchivo()}.pdf`,
        nota: reporte.meta?.notaAtribucion,
    });
};
