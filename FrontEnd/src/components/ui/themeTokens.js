/**
 * Tokens de diseño alineados con WCAG 2.1 AA.
 *
 * Jerarquía tipográfica (sobre bg-white / bg-gray-800):
 *   primary   gray-900 / gray-50   — títulos, datos clave
 *   secondary gray-700 / gray-300 — contenido normal
 *   muted     gray-600 / gray-400 — metadatos (≥ 4.5:1)
 *
 * Focus visible (2.4.7): botones usan ring; inputs conservan el estilo original del proyecto.
 */

export const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFB357] " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800";

/** Foco original — dashboard, filtros, formularios de producto */
const inputFocusDefault =
    "focus:outline-none focus:ring-2 focus:ring-[#EFB357]/40 focus:border-[#EFB357]";

/** Foco original — login / contraseña */
const inputFocusLogin =
    "focus:outline-none focus:ring-2 focus:ring-[#EFB357] focus:border-transparent";

export const text = {
    primary:   "text-gray-900 dark:text-gray-50",
    secondary: "text-gray-700 dark:text-gray-300",
    muted:     "text-gray-600 dark:text-gray-400",
    disabled:  "text-gray-400 dark:text-gray-500",
};

export const surface = {
    page:       "bg-gray-50 dark:bg-gray-900",
    card:       "bg-white dark:bg-gray-800",
    cardBorder: "border border-gray-200 dark:border-gray-600",
    cardShadow: "rounded-xl shadow-sm overflow-hidden",
};

export const card = `${surface.card} ${surface.cardBorder} ${surface.cardShadow}`;

export const cardHeaderBorder = "border-b border-gray-200 dark:border-gray-600";

export const label =
    "block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide";

export const labelBold =
    "block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5";

export const labelTable =
    "text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300";

export const inputBase =
    "w-full rounded-lg border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 " +
    "placeholder-gray-300 dark:placeholder-gray-600 " +
    `${inputFocusDefault} transition disabled:opacity-40 disabled:cursor-not-allowed`;

export const inputMd =
    "w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 " +
    "bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 " +
    "placeholder-gray-400 dark:placeholder-gray-500 " +
    `${inputFocusLogin} transition disabled:opacity-40 disabled:cursor-not-allowed`;

export const inputError =
    "border-red-400 focus:ring-red-300/40 focus:border-red-400";

export const inputSm  = `${inputBase} px-3 py-2 text-sm`;
export const inputDense = `${inputBase} px-3 py-2.5 text-sm`;
export const inputXs  = `${inputBase} px-3 py-2 text-xs text-gray-700 dark:text-gray-300`;

/** Formularios de registro — mismo borde fino que el resto del sistema */
export const inputAuth = inputSm;

export const selectSm = `${inputSm} appearance-none cursor-pointer`;
export const selectXs = `${inputXs} appearance-none cursor-pointer`;

export const inputIcon =
    "absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none";

/** Campos de filtro en fila con el mismo ancho */
export const filtroCampoIgual = "flex-1 min-w-0 basis-0";

export const filterBar = `${card} p-4 flex flex-wrap items-center gap-3`;

export const btnPrimary =
    `px-4 py-2 text-sm font-semibold text-white bg-[#EC7A21] hover:bg-[#d96a15] ` +
    `rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${focusRing}`;

export const btnGhost =
    `px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 ` +
    `hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg ${focusRing}`;

export const btnText =
    `text-xs font-semibold text-[#EC7A21] hover:text-[#CF620C] transition-colors ${focusRing}`;

export const btnIcon =
    `inline-flex items-center justify-center rounded-lg transition-colors ${focusRing}`;

// ── Tablas ──────────────────────────────────────────────────────────────────

export const tableWrapper = card;

export const tableHeadRow =
    "border-b-2 border-gray-200 dark:border-gray-600 bg-gray-100/90 dark:bg-gray-900/80";

export const tableHeadCell =
    `px-4 py-3 text-left ${labelTable} whitespace-nowrap`;

/** Encabezados de tablas en reportes admin — identidad SGPA */
export const tableHeadRowReporte =
    "border-b border-[#d96a15]/60 bg-[#EC7A21]/90 dark:bg-[#b85a18]/90";

export const tableHeadCellReporte =
    "px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap";

export const tableHeadCellReporteRight =
    `${tableHeadCellReporte} text-right`;

export const tableBody =
    "divide-y divide-gray-200 dark:divide-gray-600";

export const tableRow =
    "transition-colors even:bg-gray-50/80 dark:even:bg-gray-900/40 " +
    "hover:bg-[#ffc20e]/12 dark:hover:bg-[#ffc20e]/10";

export const tableCellPrimary =
    `text-xs font-semibold ${text.primary}`;

export const tableCellSecondary =
    `text-xs ${text.secondary}`;

export const tableCellMuted =
    `text-xs ${text.muted}`;

export const tableCellSubtext =
    `text-[11px] ${text.muted}`;

export const tablePaginationBar =
    "px-4 py-3 border-t-2 border-gray-200 dark:border-gray-600 bg-gray-100/70 dark:bg-gray-900/50";
