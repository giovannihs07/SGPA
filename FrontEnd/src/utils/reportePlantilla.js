import jsPDF from "jspdf";
import * as XLSX from "xlsx-js-style";
import { FOOTER } from "../components/layout/footerConfig";
import { fechaLocalISO } from "../pages/docente/components/productoHelpers";

/**
 * Identidad visual común de los reportes exportados (PDF y Excel).
 */

export const COLOR_PRIMARIO = [236, 122, 33];
export const COLOR_SECUNDARIO = [100, 100, 100];
export const INSTITUCION = FOOTER.institution;

const SISTEMA = "SGPA — Producción académica docente";
const LOGO_URL = `${import.meta.env.BASE_URL}logo-udc-colores-planos.svg`;
const LOGO_ANCHO_PX = 240;
const LOGO_ALTO_MM = 16;
const MARGEN = 14;
const ALTO_PIE = 18;

export const fechaArchivo = () => fechaLocalISO();

const fechaGeneracion = (generadoEn) =>
    (generadoEn ? new Date(generadoEn) : new Date()).toLocaleString("es-CO");

// ── Logo ──────────────────────────────────────────────────────────────────────

let logoPromesa = null;

/** jsPDF no acepta SVG: se rasteriza una vez a PNG. Si falla, resuelve null y el PDF sale sin logo. */
const cargarLogoPng = () => {
    if (!logoPromesa) {
        logoPromesa = new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const ratio = img.naturalHeight / img.naturalWidth || 1;
                    const canvas = document.createElement("canvas");
                    canvas.width = LOGO_ANCHO_PX;
                    canvas.height = Math.round(LOGO_ANCHO_PX * ratio);
                    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve({ dataUrl: canvas.toDataURL("image/png"), ratio });
                } catch {
                    resolve(null);
                }
            };
            img.onerror = () => resolve(null);
            img.src = LOGO_URL;
        }).then((logo) => {
            if (!logo) logoPromesa = null;
            return logo;
        });
    }
    return logoPromesa;
};

// ── PDF ───────────────────────────────────────────────────────────────────────

const encabezadoPdf = (doc, { titulo, subtitulo, generadoEn, logo }) => {
    const ancho = doc.internal.pageSize.getWidth();
    let x = MARGEN;

    if (logo) {
        const anchoLogo = LOGO_ALTO_MM / logo.ratio;
        doc.addImage(logo.dataUrl, "PNG", MARGEN, 10, anchoLogo, LOGO_ALTO_MM);
        x = MARGEN + anchoLogo + 4;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(INSTITUCION, x, 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLOR_SECUNDARIO);
    doc.text(SISTEMA, x, 21);
    doc.text(`Generado: ${fechaGeneracion(generadoEn)}`, ancho - MARGEN, 16, { align: "right" });

    doc.setDrawColor(...COLOR_PRIMARIO);
    doc.setLineWidth(0.6);
    doc.line(MARGEN, 29, ancho - MARGEN, 29);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text(titulo, MARGEN, 36);

    if (subtitulo) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...COLOR_SECUNDARIO);
        doc.text(subtitulo, MARGEN, 41);
        return 46;
    }
    return 41;
};

/** Crea el documento con el encabezado institucional y devuelve la Y donde empieza el contenido. */
export const iniciarPdf = async ({ titulo, subtitulo, generadoEn, orientation = "landscape" }) => {
    const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
    const logo = await cargarLogoPng();
    const startY = encabezadoPdf(doc, { titulo, subtitulo, generadoEn, logo });
    return { doc, startY };
};

/** Opciones comunes de autoTable: "principal" (métricas, conteos), "detalle" (listados largos), "filtros". */
export const estiloTabla = (variante = "principal") => {
    const esFiltros = variante === "filtros";
    return {
        theme: esFiltros ? "grid" : "striped",
        headStyles: {
            fillColor: esFiltros ? COLOR_SECUNDARIO : COLOR_PRIMARIO,
            textColor: 255,
            fontStyle: "bold",
        },
        alternateRowStyles: esFiltros ? undefined : { fillColor: [248, 248, 248] },
        styles: {
            fontSize: variante === "detalle" ? 6.5 : 8,
            overflow: "linebreak",
            cellPadding: 1.5,
        },
        margin: { left: MARGEN, right: MARGEN, bottom: ALTO_PIE },
    };
};

export const siguienteY = (doc, espacio = 8) => doc.lastAutoTable.finalY + espacio;

/** Nota opcional tras la última tabla, pie con numeración en todas las páginas y descarga. */
export const finalizarPdf = (doc, { nombreArchivo, nota }) => {
    const ancho = doc.internal.pageSize.getWidth();
    const alto = doc.internal.pageSize.getHeight();

    if (nota) {
        doc.setPage(doc.getNumberOfPages());
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7);
        doc.setTextColor(...COLOR_SECUNDARIO);
        const lineas = doc.splitTextToSize(nota, ancho - 2 * MARGEN);
        let y = (doc.lastAutoTable?.finalY ?? 40) + 8;
        if (y + lineas.length * 3.5 > alto - ALTO_PIE) {
            doc.addPage();
            y = 20;
        }
        doc.text(lineas, MARGEN, y);
    }

    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setDrawColor(220);
        doc.setLineWidth(0.2);
        doc.line(MARGEN, alto - 12, ancho - MARGEN, alto - 12);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(...COLOR_SECUNDARIO);
        doc.text(`${INSTITUCION} · SGPA`, MARGEN, alto - 7);
        doc.text(`Página ${i} de ${total}`, ancho - MARGEN, alto - 7, { align: "right" });
    }

    doc.save(nombreArchivo);
};

// ── Excel ─────────────────────────────────────────────────────────────────────

const BORDE = { style: "thin", color: { rgb: "D9D9D9" } };
const BORDES = { top: BORDE, bottom: BORDE, left: BORDE, right: BORDE };

const ESTILO_TITULO = { font: { bold: true, sz: 14 } };
const ESTILO_SUBTITULO = { font: { sz: 9, color: { rgb: "666666" } } };
const ESTILO_ENCABEZADO = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { patternType: "solid", fgColor: { rgb: "EC7A21" } },
    alignment: { vertical: "center", wrapText: true },
    border: BORDES,
};
const ESTILO_CELDA = { alignment: { vertical: "top", wrapText: true }, border: BORDES };

const FILA_ENCABEZADO = 2;
const ANCHO_MIN = 8;
const ANCHO_MAX = 60;

const anchoTexto = (v) => (v === null || v === undefined ? 0 : String(v).length);

/**
 * Hoja con título, línea institucional, encabezados con el color del SGPA,
 * anchos de columna según el contenido y autofiltro.
 */
export const hojaTabla = (filas, { titulo, autofiltro = true }) => {
    const datos = filas?.length ? filas : [{ Resultado: "Sin datos" }];
    const columnas = Object.keys(datos[0]);
    const ultimaCol = columnas.length - 1;
    const ultimaFila = FILA_ENCABEZADO + datos.length;

    const ws = XLSX.utils.json_to_sheet(datos, { origin: `A${FILA_ENCABEZADO + 1}` });
    XLSX.utils.sheet_add_aoa(ws, [
        [titulo],
        [`${INSTITUCION} · SGPA · Generado: ${fechaGeneracion()}`],
    ], { origin: "A1" });

    ws.A1.s = ESTILO_TITULO;
    ws.A2.s = ESTILO_SUBTITULO;
    if (ultimaCol > 0) {
        ws["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: ultimaCol } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: ultimaCol } },
        ];
    }

    for (let r = FILA_ENCABEZADO; r <= ultimaFila; r++) {
        for (let c = 0; c <= ultimaCol; c++) {
            const ref = XLSX.utils.encode_cell({ r, c });
            if (!ws[ref]) ws[ref] = { t: "s", v: "" };
            ws[ref].s = r === FILA_ENCABEZADO ? ESTILO_ENCABEZADO : ESTILO_CELDA;
        }
    }

    ws["!cols"] = columnas.map((col) => {
        const max = Math.max(anchoTexto(col), ...datos.map((fila) => anchoTexto(fila[col])));
        return { wch: Math.min(ANCHO_MAX, Math.max(ANCHO_MIN, max + 2)) };
    });
    ws["!rows"] = [{ hpt: 22 }];

    if (autofiltro && filas?.length) {
        ws["!autofilter"] = {
            ref: XLSX.utils.encode_range({
                s: { r: FILA_ENCABEZADO, c: 0 },
                e: { r: ultimaFila, c: ultimaCol },
            }),
        };
    }

    return ws;
};

/** Tabla de dos columnas (filtros, resumen) a partir de pares [clave, valor]. */
export const hojaClaveValor = (pares, { titulo, encabezados = ["Métrica", "Valor"] }) =>
    hojaTabla(
        (pares ?? []).map(([clave, valor]) => ({
            [encabezados[0]]: clave,
            [encabezados[1]]: valor ?? "—",
        })),
        { titulo, autofiltro: false },
    );

export const nuevoLibro = () => XLSX.utils.book_new();

export const agregarHoja = (wb, ws, nombre) => XLSX.utils.book_append_sheet(wb, ws, nombre);

export const escribirLibro = (wb, nombreArchivo) => XLSX.writeFile(wb, nombreArchivo);
