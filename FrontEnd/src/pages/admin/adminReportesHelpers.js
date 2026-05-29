import { esReciente, matchRangoFecha } from "../docente/components/productoHelpers";

export const nombreDocente = (p) =>
    [p?.docenteNombre, p?.docenteApellido].filter(Boolean).join(" ") || "Sin docente";

export const construirMapaDocentes = (docentes) => {
    const map = new Map();
    for (const d of docentes ?? []) {
        const programas = [...(d.programas ?? [])];
        map.set(d.id, {
            facultadIds: new Set(programas.map((p) => p.facultadId).filter(Boolean)),
            facultadNombres: [...new Set(programas.map((p) => p.facultadNombre).filter(Boolean))],
            programaIds: new Set(programas.map((p) => p.id).filter(Boolean)),
            programaNombres: programas.map((p) => p.nombre).filter(Boolean),
        });
    }
    return map;
};

export const enriquecerProductosConDocente = (productos, mapaDocentes) =>
    (productos ?? []).map((p) => {
        const info = mapaDocentes.get(p.docenteId);
        return {
            ...p,
            facultadIds: info ? [...info.facultadIds] : [],
            facultadNombres: info?.facultadNombres ?? [],
            programaIds: info ? [...info.programaIds] : [],
            programaNombres: info?.programaNombres ?? [],
            facultadesLabel: (info?.facultadNombres ?? []).join(", ") || "—",
            programasLabel: (info?.programaNombres ?? []).join(", ") || "—",
        };
    });

export const agruparConteo = (items, keyFn) => {
    const map = new Map();
    for (const item of items) {
        const key = keyFn(item) ?? "SIN_DATOS";
        map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()]
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count);
};

export const agruparPorDocente = (productos) => {
    const map = new Map();

    for (const p of productos) {
        const id = p.docenteId ?? "sin-docente";
        if (!map.has(id)) {
            map.set(id, {
                docenteId: p.docenteId,
                nombre: nombreDocente(p),
                codigo: p.docenteCodigo ?? "—",
                facultades: p.facultadesLabel ?? "—",
                programas: p.programasLabel ?? "—",
                total: 0,
                publicados: 0,
                sinPublicar: 0,
                recientes: 0,
            });
        }
        const entry = map.get(id);
        entry.total += 1;
        if (p.publicado) entry.publicados += 1;
        else entry.sinPublicar += 1;
        if (esReciente(p.fechaCreacion)) entry.recientes += 1;
    }

    return [...map.values()].sort((a, b) => b.total - a.total);
};

export const calcularResumenProduccion = (productos) => {
    const docentes = new Set(productos.map((p) => p.docenteId).filter(Boolean));
    return {
        total: productos.length,
        publicados: productos.filter((p) => p.publicado).length,
        sinPublicar: productos.filter((p) => !p.publicado).length,
        recientes: productos.filter((p) => esReciente(p.fechaCreacion)).length,
        docentesActivos: docentes.size,
    };
};

const matchIdEnSet = (valor, ids) => {
    if (valor === "TODAS" || valor === "TODOS") return true;
    const num = Number(valor);
    return ids.some((id) => id === num || String(id) === String(valor));
};

export const filtrarProductosReporte = (productos, filtros) => {
    const {
        filtroEstado,
        filtroCategoria,
        filtroSubcategoria,
        filtroFacultad,
        filtroPrograma,
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

        const matchFacultad = matchIdEnSet(filtroFacultad, p.facultadIds ?? []);

        const matchPrograma = matchIdEnSet(filtroPrograma, p.programaIds ?? []);

        const matchFecha = matchRangoFecha(p, {
            fechaDesde,
            fechaHasta,
            campo: filtroCampoFecha ?? "fechaCreacion",
        });

        const q = busqueda.trim().toLowerCase();
        const matchBusqueda = !q ||
            p.nombre?.toLowerCase().includes(q) ||
            p.descripcion?.toLowerCase().includes(q) ||
            nombreDocente(p).toLowerCase().includes(q) ||
            p.docenteCodigo?.toLowerCase().includes(q) ||
            p.facultadesLabel?.toLowerCase().includes(q) ||
            p.programasLabel?.toLowerCase().includes(q);

        return matchEstado && matchCategoria && matchSubcategoria
            && matchFacultad && matchPrograma && matchFecha && matchBusqueda;
    });
};

export const etiquetasFiltrosActivos = (filtros, { facultades, programas, labels }) => {
    const facultad = facultades.find((f) => String(f.id) === String(filtros.filtroFacultad));
    const programa = programas.find((p) => String(p.id) === String(filtros.filtroPrograma));

    return {
        estado: { TODOS: "Todos", PUBLICADO: "Publicados", SIN_PUBLICAR: "Sin publicar" }[filtros.filtroEstado] ?? filtros.filtroEstado,
        categoria: filtros.filtroCategoria === "TODAS" ? "Todas" : (labels.categoria?.[filtros.filtroCategoria] ?? filtros.filtroCategoria),
        subcategoria: filtros.filtroSubcategoria === "TODAS" ? "Todas" : (labels.subcategoria?.[filtros.filtroSubcategoria] ?? filtros.filtroSubcategoria),
        facultad: filtros.filtroFacultad === "TODAS" ? "Todas" : (facultad?.nombre ?? filtros.filtroFacultad),
        programa: filtros.filtroPrograma === "TODOS" ? "Todos" : (programa?.nombre ?? filtros.filtroPrograma),
        fecha: filtros.fechaDesde || filtros.fechaHasta
            ? `${filtros.fechaDesde || "…"} — ${filtros.fechaHasta || "…"} (${filtros.filtroCampoFecha === "fechaPublicacion" ? "publicación" : "creación"})`
            : "Todas",
        busqueda: filtros.busqueda?.trim() || "—",
    };
};
