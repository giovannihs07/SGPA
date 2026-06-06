import { useState, useEffect, useCallback, useMemo } from "react";
import {
    getTaxonomiaEstado,
    cargarTaxonomiaPredeterminada,
    getCategorias,
    crearCategoria,
    actualizarCategoria,
    activarCategoria,
    desactivarCategoria,
    eliminarCategoria,
    getSubcategorias,
    crearSubcategoria,
    actualizarSubcategoria,
    activarSubcategoria,
    desactivarSubcategoria,
    eliminarSubcategoria,
    getTiposProductoAdmin,
    getTipoProducto,
    crearTipoProducto,
    actualizarTipoProducto,
    activarTipoProducto,
    desactivarTipoProducto,
    eliminarTipoProducto,
} from "../../services/taxonomiaService";
import { notifySuccess, notifyError, notifyConfirm } from "../../utils/notify";

const EMPTY_CATEGORIA = { nombre: "" };
const EMPTY_SUBCATEGORIA = { nombre: "", categoriaId: "" };
const EMPTY_ATRIBUTO = {
    nombreAtributo: "",
    etiqueta: "",
    tipoDato: "TEXT",
    requerido: true,
    orden: 1,
    opciones: "",
};
const EMPTY_TIPO = {
    nombre: "",
    subcategoriaId: "",
    atributos: [{ ...EMPTY_ATRIBUTO }],
};

const htmlListaAdvertencia = (lineas) =>
    `<ul class="text-left text-sm text-gray-600 dark:text-gray-300 space-y-2.5 mt-3 list-disc pl-5 leading-relaxed">${
        lineas.map((l) => `<li>${l}</li>`).join("")
    }</ul>`;

/** Confirmación antes de desactivar categoría, subcategoría o tipo. */
const confirmarDesactivacionTaxonomia = (nivel, item) => {
    const nombre = item.nombre ?? "—";
    const count = Number(item.productosAsociados ?? 0);

    const configs = {
        categoria: {
            title: `¿Desactivar la categoría "${nombre}"?`,
            visibilidad: "Los productos de esta categoría ya no serán visibles.",
            registro: "Los docentes no podrán registrar nuevos productos de esta categoría.",
            reactivar: "Puedes reactivarla más adelante.",
        },
        subcategoria: {
            title: `¿Desactivar la subcategoría "${nombre}"?`,
            visibilidad: "Los productos de esta subcategoría ya no serán visibles.",
            registro: "Los docentes no podrán registrar nuevos productos de esta subcategoría.",
            reactivar: "Puedes reactivarla más adelante.",
        },
        tipo: {
            title: `¿Desactivar el tipo de producto "${nombre}"?`,
            visibilidad: "Los productos de este tipo ya no serán visibles.",
            registro: "Los docentes no podrán registrar nuevos productos de este tipo.",
            reactivar: "Puedes reactivarlo más adelante.",
        },
    };

    const cfg = configs[nivel];
    const lineas = [cfg.visibilidad];

    if (count > 0) {
        lineas.push(
            `Hay <strong>${count}</strong> producto(s) registrado(s) que dejarán de ser visibles.`,
        );
    }

    lineas.push(cfg.registro, cfg.reactivar);

    return notifyConfirm(cfg.title, null, {
        html: htmlListaAdvertencia(lineas),
    });
};

export const useConfiguracionProductos = () => {
    const [estado, setEstado] = useState(null);
    const [modoManual, setModoManual] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [seeding, setSeeding] = useState(false);

    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [tipos, setTipos] = useState([]);

    const [categoriaSel, setCategoriaSel] = useState("");
    const [subcategoriaSel, setSubcategoriaSel] = useState("");

    const [formCat, setFormCat] = useState(EMPTY_CATEGORIA);
    const [editCatId, setEditCatId] = useState(null);

    const [formSub, setFormSub] = useState(EMPTY_SUBCATEGORIA);
    const [editSubId, setEditSubId] = useState(null);

    const [formTipo, setFormTipo] = useState(EMPTY_TIPO);
    const [editTipoId, setEditTipoId] = useState(null);
    const [tipoDetalle, setTipoDetalle] = useState(null);
    const [loadingDetalleTipo, setLoadingDetalleTipo] = useState(false);
    const [subTab, setSubTab] = useState("categorias");

    const taxonomiaConfigurada = Boolean(estado?.existe);
    const mostrarSetup = !loading && !taxonomiaConfigurada && !modoManual;
    const mostrarGestion = taxonomiaConfigurada || modoManual;
    const esFlujoManual = modoManual && !taxonomiaConfigurada;

    const pasoManual = useMemo(() => {
        if (!esFlujoManual) return null;
        const cats = Number(estado?.categorias ?? categorias.length);
        const subs = Number(estado?.subcategorias ?? 0);
        const tiposCount = Number(estado?.tipos ?? 0);
        if (cats === 0) return 1;
        if (subs === 0) return 2;
        if (tiposCount === 0) return 3;
        return 4;
    }, [esFlujoManual, estado, categorias.length]);

    const fetchEstado = useCallback(async () => {
        const data = await getTaxonomiaEstado();
        setEstado(data);
        return data;
    }, []);

    const fetchCategorias = useCallback(async () => {
        const data = await getCategorias(false);
        setCategorias(data);
        if (data.length) {
            setCategoriaSel((prev) => prev || String(data[0].id));
        }
        return data;
    }, []);

    const refetch = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await fetchEstado();
            await fetchCategorias();
        } catch (e) {
            setError(e.response?.data?.error ?? e.message ?? "Error al cargar taxonomía");
        } finally {
            setLoading(false);
        }
    }, [fetchEstado, fetchCategorias]);

    useEffect(() => { refetch(); }, [refetch]);

    useEffect(() => {
        if (!categoriaSel) { setSubcategorias([]); setSubcategoriaSel(""); return; }
        getSubcategorias(Number(categoriaSel))
            .then((data) => {
                setSubcategorias(data);
                setSubcategoriaSel(data[0] ? String(data[0].id) : "");
            })
            .catch((e) => notifyError("Error", e.response?.data?.error ?? "No se pudieron cargar subcategorías"));
    }, [categoriaSel]);

    useEffect(() => {
        if (!subcategoriaSel) { setTipos([]); return; }
        getTiposProductoAdmin(Number(subcategoriaSel))
            .then(setTipos)
            .catch((e) => notifyError("Error", e.response?.data?.error ?? "No se pudieron cargar tipos"));
    }, [subcategoriaSel]);

    const elegirModoManual = () => {
        setModoManual(true);
        setSubTab("categorias");
        setFormSub((prev) => ({ ...prev, categoriaId: categoriaSel }));
        setFormTipo((prev) => ({ ...prev, subcategoriaId: subcategoriaSel }));
        notifySuccess(
            "Modo manual",
            "Paso 1: crea al menos una categoría. Luego continúa con subcategorías y tipos.",
        );
    };

    const cargarPredeterminada = async () => {
        const ok = await notifyConfirm(
            "Cargar taxonomía predeterminada",
            "Se crearán 2 categorías, 9 subcategorías y 80 tipos de producto con sus atributos. Esta acción solo puede hacerse una vez.",
        );
        if (!ok) return;

        setSeeding(true);
        try {
            const result = await cargarTaxonomiaPredeterminada();
            await refetch();
            setModoManual(false);
            setSubTab("categorias");
            notifySuccess(
                "Taxonomía cargada",
                `${result.categorias} categorías, ${result.subcategorias} subcategorías y ${result.tipos} tipos creados.`,
            );
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? "No se pudo cargar la taxonomía predeterminada");
        } finally {
            setSeeding(false);
        }
    };

    // ── Categoría ───────────────────────────────────────────────

    const iniciarEditarCat = (cat) => {
        setEditCatId(cat.id);
        setFormCat({ nombre: cat.nombre });
    };

    const cancelarCat = () => {
        setEditCatId(null);
        setFormCat(EMPTY_CATEGORIA);
    };

    const guardarCategoria = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editCatId) {
                const updated = await actualizarCategoria(editCatId, formCat);
                setCategorias((prev) => prev.map((c) => (c.id === editCatId ? updated : c)));
                notifySuccess("Categoría actualizada", "Los datos fueron guardados.");
            } else {
                const created = await crearCategoria(formCat);
                setCategorias((prev) => [...prev, created]);
                setCategoriaSel(String(created.id));
                await fetchEstado();
                notifySuccess(
                    "Categoría creada",
                    modoManual
                        ? `"${created.nombre}" registrada. Continúa con subcategorías.`
                        : `"${created.nombre}" fue registrada.`,
                );
                if (modoManual) setSubTab("subcategorias");
            }
            cancelarCat();
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo guardar la categoría");
        } finally {
            setSaving(false);
        }
    };

    const toggleCategoria = async (cat) => {
        if (cat.activo) {
            const ok = await confirmarDesactivacionTaxonomia("categoria", cat);
            if (!ok) return;
        }
        try {
            if (cat.activo) await desactivarCategoria(cat.id);
            else await activarCategoria(cat.id);
            setCategorias((prev) =>
                prev.map((c) => (c.id === cat.id ? { ...c, activo: !cat.activo } : c)),
            );
            notifySuccess(cat.activo ? "Categoría desactivada" : "Categoría activada", cat.nombre);
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo cambiar el estado");
        }
    };

    // ── Subcategoría ────────────────────────────────────────────

    const iniciarEditarSub = (sub) => {
        setEditSubId(sub.id);
        setFormSub({ nombre: sub.nombre, categoriaId: sub.categoriaId });
    };

    const cancelarSub = () => {
        setEditSubId(null);
        setFormSub({ ...EMPTY_SUBCATEGORIA, categoriaId: categoriaSel });
    };

    const guardarSubcategoria = async (e) => {
        e.preventDefault();
        if (!categoriaSel) return notifyError("Error", "Selecciona una categoría");
        setSaving(true);
        const payload = { ...formSub, categoriaId: Number(categoriaSel) };
        try {
            if (editSubId) {
                const updated = await actualizarSubcategoria(editSubId, payload);
                setSubcategorias((prev) => prev.map((s) => (s.id === editSubId ? updated : s)));
                notifySuccess("Subcategoría actualizada", "Los datos fueron guardados.");
            } else {
                const created = await crearSubcategoria(payload);
                setSubcategorias((prev) => [...prev, created]);
                setSubcategoriaSel(String(created.id));
                await fetchEstado();
                notifySuccess(
                    "Subcategoría creada",
                    modoManual
                        ? `"${created.nombre}" registrada. Continúa con tipos de producto.`
                        : `"${created.nombre}" fue registrada.`,
                );
                if (modoManual) setSubTab("tipos");
            }
            cancelarSub();
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo guardar la subcategoría");
        } finally {
            setSaving(false);
        }
    };

    const toggleSubcategoria = async (sub) => {
        if (sub.activo) {
            const ok = await confirmarDesactivacionTaxonomia("subcategoria", sub);
            if (!ok) return;
        }
        try {
            if (sub.activo) await desactivarSubcategoria(sub.id);
            else await activarSubcategoria(sub.id);
            setSubcategorias((prev) =>
                prev.map((s) => (s.id === sub.id ? { ...s, activo: !sub.activo } : s)),
            );
            notifySuccess(sub.activo ? "Subcategoría desactivada" : "Subcategoría activada", sub.nombre);
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo cambiar el estado");
        }
    };

    // ── Tipo de producto ────────────────────────────────────────

    const cargarTipoEnFormulario = (full) => {
        setEditTipoId(full.id);
        setFormTipo({
            nombre: full.nombre,
            subcategoriaId: full.subcategoriaId,
            atributos: (full.atributos ?? []).map((a, i) => ({
                nombreAtributo: a.nombreAtributo,
                etiqueta: a.etiqueta,
                tipoDato: a.tipoDato ?? "TEXT",
                requerido: a.requerido ?? true,
                orden: a.orden ?? i + 1,
                opciones: a.opciones ?? "",
            })),
        });
    };

    const scrollAlFormularioTipo = () => {
        requestAnimationFrame(() => {
            document.getElementById("form-tipo-producto")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    };

    const verDetalleTipo = async (tipo) => {
        setLoadingDetalleTipo(true);
        try {
            const full = await getTipoProducto(tipo.id);
            setTipoDetalle(full);
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? "No se pudo cargar el tipo");
        } finally {
            setLoadingDetalleTipo(false);
        }
    };

    const cerrarDetalleTipo = () => setTipoDetalle(null);

    const editarDesdeDetalle = () => {
        if (!tipoDetalle) return;
        cargarTipoEnFormulario(tipoDetalle);
        cerrarDetalleTipo();
        scrollAlFormularioTipo();
    };

    const iniciarEditarTipo = async (tipo) => {
        try {
            const full = tipoDetalle?.id === tipo.id
                ? tipoDetalle
                : await getTipoProducto(tipo.id);
            cargarTipoEnFormulario(full);
            scrollAlFormularioTipo();
        } catch (e) {
            notifyError("Error", e.response?.data?.error ?? "No se pudo cargar el tipo");
        }
    };

    const cancelarTipo = () => {
        setEditTipoId(null);
        setFormTipo({ ...EMPTY_TIPO, subcategoriaId: subcategoriaSel, atributos: [{ ...EMPTY_ATRIBUTO }] });
    };

    const agregarAtributo = () => {
        setFormTipo((prev) => ({
            ...prev,
            atributos: [
                ...prev.atributos,
                { ...EMPTY_ATRIBUTO, orden: prev.atributos.length + 1 },
            ],
        }));
    };

    const quitarAtributo = (index) => {
        setFormTipo((prev) => ({
            ...prev,
            atributos: prev.atributos.filter((_, i) => i !== index),
        }));
    };

    const actualizarAtributo = (index, field, value) => {
        setFormTipo((prev) => ({
            ...prev,
            atributos: prev.atributos.map((a, i) =>
                i === index ? { ...a, [field]: value } : a,
            ),
        }));
    };

    const guardarTipo = async (e) => {
        e.preventDefault();
        if (!subcategoriaSel) return notifyError("Error", "Selecciona una subcategoría");
        if (!formTipo.atributos.length)
            return notifyError("Error", "Debe tener al menos un atributo");

        setSaving(true);
        const payload = {
            nombre: formTipo.nombre.trim(),
            subcategoriaId: Number(subcategoriaSel),
            atributos: formTipo.atributos.map((a, i) => ({
                nombreAtributo: a.nombreAtributo.trim(),
                etiqueta: a.etiqueta.trim(),
                tipoDato: a.tipoDato,
                requerido: a.requerido ?? true,
                orden: a.orden ?? i + 1,
                opciones: a.tipoDato === "SELECT" ? a.opciones : null,
            })),
        };

        try {
            if (editTipoId) {
                const updated = await actualizarTipoProducto(editTipoId, payload);
                setTipos((prev) => prev.map((t) => (t.id === editTipoId ? updated : t)));
                if (tipoDetalle?.id === editTipoId) setTipoDetalle(updated);
                notifySuccess("Tipo actualizado", "Los datos fueron guardados.");
            } else {
                const created = await crearTipoProducto(payload);
                setTipos((prev) => [...prev, created]);
                await fetchEstado();
                notifySuccess("Tipo creado", `"${created.nombre}" fue registrado.`);
            }
            cancelarTipo();
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo guardar el tipo");
        } finally {
            setSaving(false);
        }
    };

    const toggleTipo = async (tipo) => {
        if (tipo.activo) {
            const ok = await confirmarDesactivacionTaxonomia("tipo", tipo);
            if (!ok) return;
        }
        try {
            if (tipo.activo) await desactivarTipoProducto(tipo.id);
            else await activarTipoProducto(tipo.id);
            setTipos((prev) =>
                prev.map((t) => (t.id === tipo.id ? { ...t, activo: !t.activo } : t)),
            );
            if (tipoDetalle?.id === tipo.id) {
                setTipoDetalle((prev) => prev ? { ...prev, activo: !tipo.activo } : prev);
            }
            notifySuccess(tipo.activo ? "Tipo desactivado" : "Tipo activado", tipo.nombre);
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo cambiar el estado");
        }
    };

    const eliminarCategoriaHandler = async (cat) => {
        if (!cat.eliminable) {
            return notifyError(
                "No se puede eliminar",
                `Hay ${cat.productosAsociados} producto(s) registrados en esta categoría.`,
            );
        }
        const tipos = cat.tiposAsociados ?? 0;
        const subs = cat.subcategoriasAsociadas ?? 0;
        const ok = await notifyConfirm(
            "Eliminar categoría",
            `Se eliminarán ${subs} subcategoría(s) y ${tipos} tipo(s) de producto. Esta acción no se puede deshacer.`,
        );
        if (!ok) return;
        try {
            await eliminarCategoria(cat.id);
            setCategorias((prev) => prev.filter((c) => c.id !== cat.id));
            if (String(cat.id) === categoriaSel) setCategoriaSel("");
            await fetchEstado();
            notifySuccess("Categoría eliminada", `"${cat.nombre}" y su taxonomía asociada fueron eliminadas.`);
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo eliminar la categoría");
        }
    };

    const eliminarSubcategoriaHandler = async (sub) => {
        if (!sub.eliminable) {
            return notifyError(
                "No se puede eliminar",
                `Hay ${sub.productosAsociados} producto(s) registrados en los tipos de esta subcategoría.`,
            );
        }
        const tipos = sub.tiposAsociados ?? 0;
        const ok = await notifyConfirm(
            "Eliminar subcategoría",
            `Se eliminarán ${tipos} tipo(s) de producto asociados. Esta acción no se puede deshacer.`,
        );
        if (!ok) return;
        try {
            await eliminarSubcategoria(sub.id);
            setSubcategorias((prev) => prev.filter((s) => s.id !== sub.id));
            if (String(sub.id) === subcategoriaSel) setSubcategoriaSel("");
            await fetchEstado();
            notifySuccess("Subcategoría eliminada", `"${sub.nombre}" y sus tipos fueron eliminados.`);
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo eliminar la subcategoría");
        }
    };

    const eliminarTipoHandler = async (tipo) => {
        if (!tipo.eliminable) {
            return notifyError(
                "No se puede eliminar",
                `Hay ${tipo.productosAsociados} producto(s) registrado(s) con este tipo.`,
            );
        }
        const ok = await notifyConfirm(
            "Eliminar tipo de producto",
            `¿Eliminar "${tipo.nombre}" y todos sus atributos? Esta acción no se puede deshacer.`,
        );
        if (!ok) return;
        try {
            await eliminarTipoProducto(tipo.id);
            setTipos((prev) => prev.filter((t) => t.id !== tipo.id));
            if (tipoDetalle?.id === tipo.id) cerrarDetalleTipo();
            await fetchEstado();
            notifySuccess("Tipo eliminado", `"${tipo.nombre}" fue eliminado.`);
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo eliminar el tipo");
        }
    };

    return {
        loading, error, saving, seeding, refetch,
        estado, mostrarSetup, mostrarGestion, taxonomiaConfigurada,
        esFlujoManual, pasoManual, subTab, setSubTab,
        elegirModoManual, cargarPredeterminada,
        categorias, subcategorias, tipos,
        categoriaSel, setCategoriaSel,
        subcategoriaSel, setSubcategoriaSel,
        formCat, setFormCat, editCatId,
        formSub, setFormSub, editSubId,
        formTipo, setFormTipo, editTipoId,
        guardarCategoria, iniciarEditarCat, cancelarCat, toggleCategoria,
        guardarSubcategoria, iniciarEditarSub, cancelarSub, toggleSubcategoria,
        guardarTipo, iniciarEditarTipo, cancelarTipo, toggleTipo,
        tipoDetalle, loadingDetalleTipo, verDetalleTipo, cerrarDetalleTipo, editarDesdeDetalle,
        eliminarCategoria: eliminarCategoriaHandler,
        eliminarSubcategoria: eliminarSubcategoriaHandler,
        eliminarTipo: eliminarTipoHandler,
        agregarAtributo, quitarAtributo, actualizarAtributo,
    };
};
