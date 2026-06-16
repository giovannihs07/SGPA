/**
 * Filas para exportar conteos por categoría / subcategoría / tipo.
 */
export const filasConteoExcel = (items, labelFn, totalGeneral = 0) =>
    (items ?? []).map(({ key, count }) => ({
        Nombre: labelFn(key) ?? key ?? "—",
        "Total productos": count,
        "% del total": totalGeneral > 0 ? Math.round((count / totalGeneral) * 100) : 0,
    }));

export const bodyConteoPdf = (items, labelFn, totalGeneral = 0) =>
    (items ?? []).map(({ key, count }) => [
        labelFn(key) ?? key ?? "—",
        count,
        totalGeneral > 0 ? `${Math.round((count / totalGeneral) * 100)}%` : "0%",
    ]);
