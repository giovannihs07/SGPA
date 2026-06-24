import { useState, useEffect, useMemo, useCallback } from "react";
import {
    getProductosPublicados, getProductoPorId, eliminarProducto,
    descargarArchivo, descargarArchivoPublico,
    publicarProducto, despublicarProducto,
    getProductoSchema,
} from "../../services/productoServices";
import { getFacultades, getProgramas } from "../../services/institucionService";
import { obtenerArchivosProducto } from "../../pages/docente/components/productoHelpers";
import { notifySuccess, notifyError } from "../../utils/notify";
import { esReciente, matchRangoFecha } from "../../pages/docente/components/productoHelpers";
import {
    intentarEliminarProducto,
    confirmPublicarProducto,
    confirmDespublicarProducto,
} from "../../pages/docente/components/misProductos/productoSwal";

const PAGE_SIZE = 10;

const nombresProgramaProducto = (producto) => {
    if (!producto?.programas) return [];
    return Array.isArray(producto.programas) ? producto.programas : [...producto.programas];
};

const coincideFacultadPrograma = (producto, filtroFacultad, filtroPrograma, programas) => {
    const nombres = nombresProgramaProducto(producto);

    if (filtroPrograma !== "TODOS") {
        const programa = programas.find((p) => String(p.id) === String(filtroPrograma));
        if (programa?.nombre) return nombres.includes(programa.nombre);
        return true;
    }

    if (filtroFacultad !== "TODAS") {
        const nombresFacultad = programas
            .filter((p) => String(p.facultadId) === String(filtroFacultad))
            .map((p) => p.nombre);
        return nombres.some((n) => nombresFacultad.includes(n));
    }

    return true;
};

export const useSuperAdminProductos = () => {
    const [productos, setProductos] = useState([]);
    const [schema, setSchema] = useState([]);
    const [facultades, setFacultades] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggling, setToggling] = useState(null);
    const [productoDetalle, setProductoDetalle] = useState(null);

    const fetchProductos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [productosData, schemaData, facultadesData, programasData] = await Promise.all([
                getProductosPublicados(),
                getProductoSchema(),
                getFacultades(),
                getProgramas(),
            ]);
            setProductos(productosData ?? []);
            setSchema(schemaData ?? []);
            setFacultades(facultadesData ?? []);
            setProgramas(programasData ?? []);
        } catch (e) {
            setError(e.response?.data?.error ?? e.response?.data?.message ?? e.message ?? "Error al cargar productos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProductos(); }, [fetchProductos]);

    const [busqueda, setBusqueda] = useState("");
    const [busquedaBorrador, setBusquedaBorrador] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("TODAS");
    const [filtroSubcategoria, setFiltroSubcategoria] = useState("TODAS");
    const [filtroTipo, setFiltroTipo] = useState("TODOS");
    const [filtroFacultad, setFiltroFacultad] = useState("TODAS");
    const [filtroPrograma, setFiltroPrograma] = useState("TODOS");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [filtroCampoFecha, setFiltroCampoFecha] = useState("fechaRegistroSgpa");
    const [pagina, setPagina] = useState(0);

    useEffect(() => {
        setBusquedaBorrador(busqueda);
    }, [busqueda]);

    const categoriasDisponibles = useMemo(() => {
        const nombres = schema.map((c) => c.nombre).filter(Boolean);
        return nombres.length ? ["TODAS", ...nombres] : ["TODAS"];
    }, [schema]);

    const subcategoriasDisponibles = useMemo(() => {
        if (!schema.length) return ["TODAS"];

        const categorias = filtroCategoria === "TODAS"
            ? schema
            : schema.filter((c) => c.nombre === filtroCategoria);
        const subs = [...new Set(
            categorias.flatMap((c) =>
                (c.subcategorias ?? []).map((s) => s.nombre).filter(Boolean),
            ),
        )];
        return ["TODAS", ...subs];
    }, [schema, filtroCategoria]);

    const tiposDisponibles = useMemo(() => {
        if (!schema.length) return ["TODOS"];

        const categorias = filtroCategoria === "TODAS"
            ? schema
            : schema.filter((c) => c.nombre === filtroCategoria);
        const subs = categorias.flatMap((c) => c.subcategorias ?? []);
        const subsFiltradas = filtroSubcategoria === "TODAS"
            ? subs
            : subs.filter((s) => s.nombre === filtroSubcategoria);
        const tipos = [...new Set(
            subsFiltradas.flatMap((sub) =>
                (sub.tipos ?? []).map((t) => t.nombre).filter(Boolean),
            ),
        )];
        return ["TODOS", ...tipos];
    }, [schema, filtroCategoria, filtroSubcategoria]);

    const programasFiltrados = useMemo(() => {
        if (filtroFacultad === "TODAS") return programas;
        return programas.filter((p) => String(p.facultadId) === String(filtroFacultad));
    }, [programas, filtroFacultad]);

    const handleFiltroCategoria = useCallback((v) => {
        setFiltroCategoria(v);
        setFiltroSubcategoria("TODAS");
        setFiltroTipo("TODOS");
        setPagina(0);
    }, []);

    const handleFiltroSubcategoria = useCallback((v) => {
        setFiltroSubcategoria(v);
        setFiltroTipo("TODOS");
        setPagina(0);
    }, []);

    const handleFiltroFacultad = useCallback((v) => {
        setFiltroFacultad(v);
        setFiltroPrograma("TODOS");
        setPagina(0);
    }, []);

    const productosFiltrados = useMemo(() =>
        productos.filter((p) => {
            const termino = busqueda.trim().toLowerCase();
            const docenteTexto = [p.docenteNombre, p.docenteApellido, p.docenteCodigo]
                .filter(Boolean)
                .join(" ");
            const matchBusqueda = !termino
                || p.nombre?.toLowerCase().includes(termino)
                || p.descripcion?.toLowerCase().includes(termino)
                || docenteTexto.toLowerCase().includes(termino);
            const matchCategoria = filtroCategoria === "TODAS" || p.categoria === filtroCategoria;
            const matchSubcategoria = filtroSubcategoria === "TODAS" || p.subcategoria === filtroSubcategoria;
            const matchTipo = filtroTipo === "TODOS" || p.tipo === filtroTipo;
            const matchInstitucion = coincideFacultadPrograma(p, filtroFacultad, filtroPrograma, programas);
            const matchFecha = matchRangoFecha(p, { fechaDesde, fechaHasta, campo: filtroCampoFecha });
            return matchBusqueda && matchCategoria && matchSubcategoria
                && matchTipo && matchInstitucion && matchFecha;
        }),
    [
        productos, busqueda, filtroCategoria, filtroSubcategoria, filtroTipo,
        filtroFacultad, filtroPrograma, programas, fechaDesde, fechaHasta, filtroCampoFecha,
    ]);

    const resumen = useMemo(() => ({
        total: productosFiltrados.length,
        ultimos30Dias: productosFiltrados.filter((p) => esReciente(p.fechaRegistroSgpa)).length,
    }), [productosFiltrados]);

    const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / PAGE_SIZE));

    useEffect(() => {
        if (pagina >= totalPaginas) setPagina(Math.max(0, totalPaginas - 1));
    }, [pagina, totalPaginas]);

    useEffect(() => {
        if (filtroTipo === "TODOS" || !tiposDisponibles.length) return;
        if (!tiposDisponibles.includes(filtroTipo)) setFiltroTipo("TODOS");
    }, [tiposDisponibles, filtroTipo]);

    useEffect(() => {
        if (filtroPrograma === "TODOS" || !programas.length) return;
        const valido = programasFiltrados.some((p) => String(p.id) === String(filtroPrograma));
        if (!valido) setFiltroPrograma("TODOS");
    }, [filtroFacultad, programasFiltrados, filtroPrograma, programas.length]);

    const productosPaginados = useMemo(() => {
        const inicio = pagina * PAGE_SIZE;
        return productosFiltrados.slice(inicio, inicio + PAGE_SIZE);
    }, [productosFiltrados, pagina]);

    const irPagina = useCallback(
        (nueva) => setPagina(Math.max(0, Math.min(nueva, totalPaginas - 1))),
        [totalPaginas],
    );

    const resetPagina = useCallback(() => setPagina(0), []);
    const aplicarBusqueda = useCallback(() => {
        const value = busquedaBorrador.trim();
        setBusquedaBorrador(value);
        setBusqueda(value);
        resetPagina();
    }, [busquedaBorrador, resetPagina]);
    const handleFiltroTipo = useCallback((v) => { setFiltroTipo(v); resetPagina(); }, [resetPagina]);
    const handleFiltroPrograma = useCallback((v) => { setFiltroPrograma(v); resetPagina(); }, [resetPagina]);
    const handleFechaDesde = useCallback((v) => { setFechaDesde(v); resetPagina(); }, [resetPagina]);
    const handleFechaHasta = useCallback((v) => { setFechaHasta(v); resetPagina(); }, [resetPagina]);
    const handleFiltroCampoFecha = useCallback((v) => { setFiltroCampoFecha(v); resetPagina(); }, [resetPagina]);

    const handleDescargar = useCallback(async (producto, archivo = null) => {
        const lista = obtenerArchivosProducto(producto);
        const target = archivo ?? lista.find((a) => a.accesoPublico) ?? lista[0];
        if (!target) {
            notifyError("Sin archivo", "Este producto no tiene archivos públicos descargables.");
            return;
        }
        if (target.descargable === false) {
            notifyError("Acceso restringido", "Solo el docente dueño puede descargar este archivo.");
            return;
        }
        try {
            if (target.id) {
                await descargarArchivoPublico(producto.id, target.id, target.nombreOriginal);
            } else {
                await descargarArchivo(producto.id, target.nombreOriginal);
            }
        } catch (e) {
            notifyError("Error", e.message ?? "No se pudo descargar el archivo");
        }
    }, []);

    const togglePublicacion = useCallback(async (producto) => {
        let visibilidad = null;
        if (producto.publicado) {
            const ok = await confirmDespublicarProducto(producto);
            if (!ok) return;
        } else {
            visibilidad = await confirmPublicarProducto(producto);
            if (!visibilidad) return;
        }

        setToggling(producto.id);
        try {
            const data = producto.publicado
                ? await despublicarProducto(producto.id)
                : await publicarProducto(producto.id, visibilidad);
            if (producto.publicado) {
                setProductos((prev) => prev.filter((p) => p.id !== producto.id));
                setProductoDetalle((prev) => (prev?.id === producto.id ? null : prev));
            } else {
                setProductos((prev) => prev.map((p) => (p.id === producto.id ? data : p)));
                setProductoDetalle((prev) => (prev?.id === data.id ? data : prev));
            }
            notifySuccess(
                producto.publicado ? "Producto despublicado" : "Producto publicado",
                `"${producto.nombre}" fue actualizado.`,
            );
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? e.response?.data?.message ?? "No se pudo actualizar el estado");
        } finally {
            setToggling(null);
        }
    }, []);

    const eliminarProductoHandler = useCallback(async (producto) => {
        const ok = await intentarEliminarProducto(producto);
        if (!ok) return;
        try {
            await eliminarProducto(producto.id);
            setProductos((prev) => prev.filter((p) => p.id !== producto.id));
            setProductoDetalle((prev) => (prev?.id === producto.id ? null : prev));
            notifySuccess("Producto eliminado", `"${producto.nombre}" fue eliminado.`);
        } catch (e) {
            notifyError(
                "Error",
                e.response?.data?.error ?? e.response?.data?.message ?? "No se pudo eliminar el producto",
            );
        }
    }, []);

    const abrirDetalle = useCallback(async (p) => {
        if (!p?.id) return;
        setProductoDetalle(p);
        try {
            const full = await getProductoPorId(p.id);
            setProductoDetalle(full);
        } catch (e) {
            notifyError(
                "Error",
                e.response?.data?.error
                ?? e.response?.data?.message
                ?? "No se pudo cargar el producto",
            );
            setProductoDetalle(null);
        }
    }, []);
    const cerrarDetalle = useCallback(() => setProductoDetalle(null), []);

    const toggleFromDetalle = useCallback(async () => {
        if (productoDetalle) await togglePublicacion(productoDetalle);
    }, [productoDetalle, togglePublicacion]);

    const eliminarFromDetalle = useCallback(async () => {
        if (!productoDetalle) return;
        const p = productoDetalle;
        cerrarDetalle();
        await eliminarProductoHandler(p);
    }, [productoDetalle, cerrarDetalle, eliminarProductoHandler]);

    return {
        productos: productosPaginados,
        productosFiltrados,
        resumen,
        loading, error, refetch: fetchProductos,
        busqueda, busquedaBorrador, setBusquedaBorrador, aplicarBusqueda,
        filtroCategoria, handleFiltroCategoria,
        filtroSubcategoria, handleFiltroSubcategoria,
        filtroTipo, setFiltroTipo: handleFiltroTipo,
        filtroFacultad, setFiltroFacultad: handleFiltroFacultad,
        filtroPrograma, setFiltroPrograma: handleFiltroPrograma,
        fechaDesde, setFechaDesde: handleFechaDesde,
        fechaHasta, setFechaHasta: handleFechaHasta,
        filtroCampoFecha, setFiltroCampoFecha: handleFiltroCampoFecha,
        categoriasDisponibles, subcategoriasDisponibles, tiposDisponibles,
        facultades, programasFiltrados,
        pagina, totalPaginas, pageSize: PAGE_SIZE, irPagina,
        abrirDetalle, cerrarDetalle, productoDetalle,
        toggleFromDetalle, eliminarFromDetalle,
        eliminarProducto: eliminarProductoHandler,
        toggling, togglePublicacion, handleDescargar,
    };
};
