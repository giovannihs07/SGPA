import {
    esReciente,
    matchRangoFecha,
    CAMPO_FECHA_REGISTRO_SGPA,
    CAMPO_FECHA_PUBLICACION_SGPA,
} from "../docente/components/productoHelpers";

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

/** Agrupa por tipo con desglose publicado / sin publicar. */
export const agruparPorTipoDetalle = (items, keyFn = (p) => p.tipo) => {
    const map = new Map();
    for (const item of items) {
        const key = keyFn(item) ?? "SIN_DATOS";
        if (!map.has(key)) {
            map.set(key, { key, count: 0, publicados: 0, sinPublicar: 0 });
        }
        const entry = map.get(key);
        entry.count += 1;
        if (item.publicado) entry.publicados += 1;
        else entry.sinPublicar += 1;
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
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
        if (esReciente(p.fechaRegistroSgpa)) entry.recientes += 1;
    }

    return [...map.values()].sort((a, b) => b.total - a.total);
};

export const calcularResumenProduccion = (productos) => {
    const docentes = new Set(productos.map((p) => p.docenteId).filter(Boolean));
    return {
        total: productos.length,
        publicados: productos.filter((p) => p.publicado).length,
        sinPublicar: productos.filter((p) => !p.publicado).length,
        recientes: productos.filter((p) => esReciente(p.fechaRegistroSgpa)).length,
        docentesActivos: docentes.size,
    };
};

export const docentesEnAlcance = (docentes, filtros) =>
    (docentes ?? []).filter((d) => {
        const programas = d.programas ?? [];
        const facultadIds = [...new Set(programas.map((p) => p.facultadId).filter(Boolean))];
        const programaIds = programas.map((p) => p.id).filter(Boolean);

        if (filtros.filtroFacultad !== "TODAS"
            && !facultadIds.some((id) => String(id) === String(filtros.filtroFacultad))) {
            return false;
        }
        if (filtros.filtroPrograma !== "TODOS"
            && !programaIds.some((id) => String(id) === String(filtros.filtroPrograma))) {
            return false;
        }
        return true;
    });

export const calcularCoberturaDocente = (docentesAlcance, productos) => {
    const conProduccion = new Set(productos.map((p) => p.docenteId).filter(Boolean));
    const total = docentesAlcance.length;
    const activos = docentesAlcance.filter((d) => conProduccion.has(d.id)).length;
    return {
        totalDocentes: total,
        docentesConProduccion: activos,
        docentesSinProduccion: Math.max(0, total - activos),
        porcentajeCobertura: total > 0 ? Math.round((activos / total) * 100) : 0,
    };
};

const acumularProduccionUnidad = (prods, docentesUnidad) => {
    const docenteIdsProduccion = new Set(prods.map((p) => p.docenteId).filter(Boolean));
    const docentesConProd = docentesUnidad.filter((d) => docenteIdsProduccion.has(d.id)).length;
    const totalDocentes = docentesUnidad.length;
    return {
        total: prods.length,
        publicados: prods.filter((p) => p.publicado).length,
        sinPublicar: prods.filter((p) => !p.publicado).length,
        recientes: prods.filter((p) => esReciente(p.fechaRegistroSgpa)).length,
        docentesConProduccion: docentesConProd,
        totalDocentes,
        porcentajeCobertura: totalDocentes > 0 ? Math.round((docentesConProd / totalDocentes) * 100) : 0,
    };
};

export const agruparPorFacultad = (productos, facultades, docentes) =>
    (facultades ?? [])
        .map((f) => {
            const prods = productos.filter((p) =>
                (p.facultadIds ?? []).some((id) => String(id) === String(f.id)));
            const docentesFacultad = docentes.filter((d) =>
                (d.programas ?? []).some((p) => String(p.facultadId) === String(f.id)));
            return {
                facultadId: f.id,
                nombre: f.nombre,
                codigo: f.codigo ?? "—",
                ...acumularProduccionUnidad(prods, docentesFacultad),
            };
        })
        .sort((a, b) => b.total - a.total);

export const agruparPorPrograma = (productos, programas, docentes) =>
    (programas ?? [])
        .map((prog) => {
            const prods = productos.filter((p) =>
                (p.programaIds ?? []).some((id) => String(id) === String(prog.id)));
            const docentesPrograma = docentes.filter((d) =>
                (d.programas ?? []).some((p) => String(p.id) === String(prog.id)));
            return {
                programaId: prog.id,
                nombre: prog.nombre,
                codigo: prog.codigo ?? "—",
                facultadNombre: prog.facultadNombre ?? "—",
                nivel: prog.nivel ?? "—",
                ...acumularProduccionUnidad(prods, docentesPrograma),
            };
        })
        .sort((a, b) => b.total - a.total);

export const agruparPorAnio = (productos, campoFecha = CAMPO_FECHA_REGISTRO_SGPA) => {
    const map = new Map();
    for (const p of productos) {
        const raw = p[campoFecha];
        if (!raw) continue;
        const anio = new Date(raw).getFullYear();
        if (Number.isNaN(anio)) continue;
        map.set(anio, (map.get(anio) ?? 0) + 1);
    }
    return [...map.entries()]
        .map(([anio, total]) => ({ anio: String(anio), total }))
        .sort((a, b) => Number(a.anio) - Number(b.anio));
};

export const presetPeriodoAutoevaluacion = (anios) => {
    const hasta = new Date();
    const desde = new Date();
    desde.setFullYear(hasta.getFullYear() - anios);
    return {
        fechaDesde: desde.toISOString().slice(0, 10),
        fechaHasta: hasta.toISOString().slice(0, 10),
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
        filtroTipo,
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

        const matchTipo =
            filtroTipo === "TODOS" || p.tipo === filtroTipo;

        const matchFacultad = matchIdEnSet(filtroFacultad, p.facultadIds ?? []);

        const matchPrograma = matchIdEnSet(filtroPrograma, p.programaIds ?? []);

        const matchFecha = matchRangoFecha(p, {
            fechaDesde,
            fechaHasta,
            campo: filtroCampoFecha ?? CAMPO_FECHA_REGISTRO_SGPA,
        });

        const q = busqueda.trim().toLowerCase();
        const matchBusqueda = !q ||
            p.nombre?.toLowerCase().includes(q) ||
            p.descripcion?.toLowerCase().includes(q) ||
            nombreDocente(p).toLowerCase().includes(q) ||
            p.docenteCodigo?.toLowerCase().includes(q) ||
            p.facultadesLabel?.toLowerCase().includes(q) ||
            p.programasLabel?.toLowerCase().includes(q);

        return matchEstado && matchCategoria && matchSubcategoria && matchTipo
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
        tipo: filtros.filtroTipo === "TODOS" ? "Todos" : (labels.tipo?.[filtros.filtroTipo] ?? filtros.filtroTipo),
        facultad: filtros.filtroFacultad === "TODAS" ? "Todas" : (facultad?.nombre ?? filtros.filtroFacultad),
        programa: filtros.filtroPrograma === "TODOS" ? "Todos" : (programa?.nombre ?? filtros.filtroPrograma),
        fecha: filtros.fechaDesde || filtros.fechaHasta
            ? `${filtros.fechaDesde || "…"} — ${filtros.fechaHasta || "…"} (${filtros.filtroCampoFecha === CAMPO_FECHA_PUBLICACION_SGPA ? "publicado en SGPA" : "registrado en SGPA"})`
            : "Todas",
        busqueda: filtros.busqueda?.trim() || "—",
    };
};

export const filasFiltrosReporteAdmin = (filtrosLabel) => [
    ["Estado", filtrosLabel.estado],
    ["Categoría", filtrosLabel.categoria],
    ["Subcategoría", filtrosLabel.subcategoria],
    ["Tipo de producto", filtrosLabel.tipo],
    ["Facultad", filtrosLabel.facultad],
    ["Programa", filtrosLabel.programa],
    ["Rango de fechas", filtrosLabel.fecha],
    ["Búsqueda", filtrosLabel.busqueda],
];
