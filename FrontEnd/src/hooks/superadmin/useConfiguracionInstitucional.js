import { useState, useEffect, useCallback } from "react";
import {
    getInstituciones, crearInstitucion, actualizarInstitucion, eliminarInstitucion,
    getFacultades, crearFacultad, actualizarFacultad, eliminarFacultad,
    getProgramas, getNivelesFormacion, crearPrograma, actualizarPrograma, eliminarPrograma,
} from "../../services/institucionService";
import { notifySuccess, notifyError, notifyConfirm } from "../../utils/notify";

const EMPTY_INSTITUCION = { nombre: "", nit: "", ciudad: "", pais: "Colombia" };
const EMPTY_FACULTAD    = { nombre: "", codigo: "", institucionId: "" };
const EMPTY_PROGRAMA    = { nombre: "", codigo: "", nivel: "", facultadId: "" };

export const useConfiguracionInstitucional = () => {
    const [instituciones, setInstituciones] = useState([]);
    const [facultades, setFacultades]       = useState([]);
    const [programas, setProgramas]         = useState([]);
    const [niveles, setNiveles]             = useState([]);
    const [loading, setLoading]             = useState(true);
    const [error, setError]                 = useState(null);
    const [saving, setSaving]               = useState(false);

    const [institucionSel, setInstitucionSel] = useState("");
    const [facultadSel, setFacultadSel]       = useState("");

    const [formInst, setFormInst] = useState(EMPTY_INSTITUCION);
    const [editInstId, setEditInstId] = useState(null);

    const [formFac, setFormFac] = useState(EMPTY_FACULTAD);
    const [editFacId, setEditFacId] = useState(null);

    const [formProg, setFormProg] = useState(EMPTY_PROGRAMA);
    const [editProgId, setEditProgId] = useState(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [insts, nivs] = await Promise.all([getInstituciones(), getNivelesFormacion()]);
            setInstituciones(insts);
            setNiveles(nivs);
            if (insts.length) {
                setInstitucionSel((prev) => prev || String(insts[0].id));
            }
        } catch (e) {
            setError(e.response?.data?.error ?? e.message ?? "Error al cargar configuración");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    useEffect(() => {
        if (!institucionSel) { setFacultades([]); setFacultadSel(""); return; }
        getFacultades(Number(institucionSel))
            .then((data) => {
                setFacultades(data);
                setFacultadSel(data[0] ? String(data[0].id) : "");
            })
            .catch((e) => notifyError("Error", e.response?.data?.error ?? "No se pudieron cargar las facultades"));
    }, [institucionSel]);

    useEffect(() => {
        if (!facultadSel) { setProgramas([]); return; }
        getProgramas({ facultadId: Number(facultadSel) })
            .then(setProgramas)
            .catch((e) => notifyError("Error", e.response?.data?.error ?? "No se pudieron cargar los programas"));
    }, [facultadSel]);

    // ── Institución ───────────────────────────────────────────────

    const iniciarEditarInst = (inst) => {
        setEditInstId(inst.id);
        setFormInst({ nombre: inst.nombre, nit: inst.nit, ciudad: inst.ciudad, pais: inst.pais });
    };

    const cancelarInst = () => {
        setEditInstId(null);
        setFormInst(EMPTY_INSTITUCION);
    };

    const guardarInstitucion = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editInstId) {
                const updated = await actualizarInstitucion(editInstId, formInst);
                setInstituciones((prev) => prev.map((i) => (i.id === editInstId ? updated : i)));
                notifySuccess("Institución actualizada", "Los datos fueron guardados.");
            } else {
                const created = await crearInstitucion(formInst);
                setInstituciones((prev) => [...prev, created]);
                setInstitucionSel(String(created.id));
                notifySuccess("Institución creada", `"${created.nombre}" fue registrada.`);
            }
            cancelarInst();
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo guardar la institución");
        } finally {
            setSaving(false);
        }
    };

    const eliminarInst = async (inst) => {
        const ok = await notifyConfirm("Eliminar institución", `¿Eliminar "${inst.nombre}"?`);
        if (!ok) return;
        try {
            await eliminarInstitucion(inst.id);
            setInstituciones((prev) => prev.filter((i) => i.id !== inst.id));
            notifySuccess("Institución eliminada", `"${inst.nombre}" fue eliminada.`);
            if (String(inst.id) === institucionSel) setInstitucionSel("");
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo eliminar la institución");
        }
    };

    // ── Facultad ──────────────────────────────────────────────────

    const iniciarEditarFac = (fac) => {
        setEditFacId(fac.id);
        setFormFac({ nombre: fac.nombre, codigo: fac.codigo ?? "", institucionId: fac.institucionId });
    };

    const cancelarFac = () => {
        setEditFacId(null);
        setFormFac({ ...EMPTY_FACULTAD, institucionId: institucionSel });
    };

    const guardarFacultad = async (e) => {
        e.preventDefault();
        if (!institucionSel) return notifyError("Error", "Selecciona una institución");
        setSaving(true);
        const payload = { ...formFac, institucionId: Number(institucionSel) };
        try {
            if (editFacId) {
                const updated = await actualizarFacultad(editFacId, payload);
                setFacultades((prev) => prev.map((f) => (f.id === editFacId ? updated : f)));
                notifySuccess("Facultad actualizada", "Los datos fueron guardados.");
            } else {
                const created = await crearFacultad(payload);
                setFacultades((prev) => [...prev, created]);
                setFacultadSel(String(created.id));
                notifySuccess("Facultad creada", `"${created.nombre}" fue registrada.`);
            }
            cancelarFac();
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo guardar la facultad");
        } finally {
            setSaving(false);
        }
    };

    const eliminarFac = async (fac) => {
        const ok = await notifyConfirm("Eliminar facultad", `¿Eliminar "${fac.nombre}"?`);
        if (!ok) return;
        try {
            await eliminarFacultad(fac.id);
            setFacultades((prev) => prev.filter((f) => f.id !== fac.id));
            notifySuccess("Facultad eliminada", `"${fac.nombre}" fue eliminada.`);
            if (String(fac.id) === facultadSel) setFacultadSel("");
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo eliminar la facultad");
        }
    };

    // ── Programa ──────────────────────────────────────────────────

    const iniciarEditarProg = (prog) => {
        setEditProgId(prog.id);
        setFormProg({
            nombre: prog.nombre,
            codigo: prog.codigo ?? "",
            nivel: prog.nivel,
            facultadId: prog.facultadId,
        });
    };

    const cancelarProg = () => {
        setEditProgId(null);
        setFormProg({ ...EMPTY_PROGRAMA, facultadId: facultadSel });
    };

    const guardarPrograma = async (e) => {
        e.preventDefault();
        if (!facultadSel) return notifyError("Error", "Selecciona una facultad");
        setSaving(true);
        const payload = { ...formProg, facultadId: Number(facultadSel) };
        try {
            if (editProgId) {
                const updated = await actualizarPrograma(editProgId, payload);
                setProgramas((prev) => prev.map((p) => (p.id === editProgId ? updated : p)));
                notifySuccess("Programa actualizado", "Los datos fueron guardados.");
            } else {
                const created = await crearPrograma(payload);
                setProgramas((prev) => [...prev, created]);
                notifySuccess("Programa creado", `"${created.nombre}" fue registrado.`);
            }
            cancelarProg();
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo guardar el programa");
        } finally {
            setSaving(false);
        }
    };

    const eliminarProg = async (prog) => {
        const ok = await notifyConfirm("Eliminar programa", `¿Eliminar "${prog.nombre}"?`);
        if (!ok) return;
        try {
            await eliminarPrograma(prog.id);
            setProgramas((prev) => prev.filter((p) => p.id !== prog.id));
            notifySuccess("Programa eliminado", `"${prog.nombre}" fue eliminado.`);
        } catch (err) {
            notifyError("Error", err.response?.data?.error ?? "No se pudo eliminar el programa");
        }
    };

    return {
        loading, error, saving, refetch: fetchAll,
        instituciones, facultades, programas, niveles,
        institucionSel, setInstitucionSel,
        facultadSel, setFacultadSel,
        formInst, setFormInst, editInstId,
        formFac, setFormFac, editFacId,
        formProg, setFormProg, editProgId,
        guardarInstitucion, iniciarEditarInst, cancelarInst, eliminarInst,
        guardarFacultad, iniciarEditarFac, cancelarFac, eliminarFac,
        guardarPrograma, iniciarEditarProg, cancelarProg, eliminarProg,
    };
};
