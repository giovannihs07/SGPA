import {
    esReciente,
    matchRangoFecha,
    CAMPO_FECHA_REGISTRO_SGPA,
    CAMPO_FECHA_PUBLICACION_SGPA,
} from "./components/productoHelpers";

export const calcularResumenPersonal = (productos) => ({
    total: productos.length,
    publicados: productos.filter((p) => p.publicado).length,
    sinPublicar: productos.filter((p) => !p.publicado).length,
    recientes: productos.filter((p) => esReciente(p.fechaRegistroSgpa)).length,
});

export const filtrarMisProductosReporte = (productos, filtros) => {
    const {
        filtroEstado,
        filtroCategoria,
        filtroSubcategoria,
        fechaDesde,
        fechaHasta,
        filtroCampoFecha,
        busqueda,
    } = filtros;

    return productos.filter((p) => {
        const matchEstado =
            filtroEstado === "TODOS" ||
            (filtroEstado === "PUBLICADO" && p.publicado) ||
            (filtroEstado === "SIN_PUBLICAR" && !p.publicado);

        const matchCategoria =
            filtroCategoria === "TODAS" || p.categoria === filtroCategoria;

        const matchSubcategoria =
            filtroSubcategoria === "TODAS" || p.subcategoria === filtroSubcategoria;

        const matchFecha = matchRangoFecha(p, {
            fechaDesde,
            fechaHasta,
            campo: filtroCampoFecha ?? CAMPO_FECHA_REGISTRO_SGPA,
        });

        const q = busqueda.trim().toLowerCase();
        const matchBusqueda = !q ||
            p.nombre?.toLowerCase().includes(q) ||
            p.descripcion?.toLowerCase().includes(q);

        return matchEstado && matchCategoria && matchSubcategoria && matchFecha && matchBusqueda;
    });
};

export const etiquetasFiltrosDocente = (filtros, labels) => ({
    estado: { TODOS: "Todos", PUBLICADO: "Publicados", SIN_PUBLICAR: "Sin publicar" }[filtros.filtroEstado] ?? filtros.filtroEstado,
    categoria: filtros.filtroCategoria === "TODAS" ? "Todas" : (labels.categoria?.[filtros.filtroCategoria] ?? filtros.filtroCategoria),
    subcategoria: filtros.filtroSubcategoria === "TODAS" ? "Todas" : (labels.subcategoria?.[filtros.filtroSubcategoria] ?? filtros.filtroSubcategoria),
    fecha: filtros.fechaDesde || filtros.fechaHasta
        ? `${filtros.fechaDesde || "…"} — ${filtros.fechaHasta || "…"} (${filtros.filtroCampoFecha === CAMPO_FECHA_PUBLICACION_SGPA ? "publicado en SGPA" : "registrado en SGPA"})`
        : "Todas",
    busqueda: filtros.busqueda?.trim() || "—",
});

export const filasFiltrosReporteDocente = (filtrosLabel) => [
    ["Estado", filtrosLabel.estado],
    ["Categoría", filtrosLabel.categoria],
    ["Subcategoría", filtrosLabel.subcategoria],
    ["Rango de fechas", filtrosLabel.fecha],
    ["Búsqueda", filtrosLabel.busqueda],
];

export const nombreDocentePerfil = (docente) => {
    if (!docente) return "—";
    const nombre = [docente.nombre, docente.apellido].filter(Boolean).join(" ").trim();
    return nombre || "—";
};
