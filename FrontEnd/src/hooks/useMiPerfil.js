import { useState, useEffect, useCallback } from "react";
import {
    getMiPerfil,
    actualizarMiPerfil,
    actualizarPerfilDocente,
    actualizarProgramasPerfil,
    actualizarPerfilAdministrativo,
    agregarTituloPerfil,
    eliminarTituloPerfil,
    cambiarPassword,
} from "../services/perfilService";
import { getApiErrorMessage } from "../utils/apiError";
import {
    validarDatosPersonales,
    validarCambioPassword,
    validarPerfilDocente,
    validarTituloAcademico,
    validarProgramasPerfil,
    validarPerfilAdministrativo,
    programasDesdePerfil,
    extraerProgramaIds,
} from "../pages/perfil/perfilHelpers";

const datosIniciales = { nombre: "", apellido: "", telefono: "" };
const docenteInicial = { codigoDocente: "", tipoContrato: "" };
const administrativoInicial = { cargo: "", dependencia: "" };
const programaInicial = { facultadId: "", programaId: "", facultadNombre: "", programaNombre: "" };
const tituloInicial = { titulo: "", nivel: "", institucion: "", fechaObtencion: "", pais: "" };
const passwordInicial = { passwordActual: "", passwordNuevo: "", passwordConfirmacion: "" };

export const useMiPerfil = () => {
    const [perfil, setPerfil] = useState(null);
    const [datos, setDatos] = useState(datosIniciales);
    const [docente, setDocente] = useState(docenteInicial);
    const [administrativo, setAdministrativo] = useState(administrativoInicial);
    const [programas, setProgramas] = useState([programaInicial]);
    const [nuevoTitulo, setNuevoTitulo] = useState(tituloInicial);
    const [passwords, setPasswords] = useState(passwordInicial);
    const [loading, setLoading] = useState(true);
    const [savingDatos, setSavingDatos] = useState(false);
    const [savingDocente, setSavingDocente] = useState(false);
    const [savingProgramas, setSavingProgramas] = useState(false);
    const [savingAdministrativo, setSavingAdministrativo] = useState(false);
    const [savingTitulo, setSavingTitulo] = useState(false);
    const [deletingTituloId, setDeletingTituloId] = useState(null);
    const [savingPassword, setSavingPassword] = useState(false);
    const [error, setError] = useState(null);
    const [fieldErrorsDatos, setFieldErrorsDatos] = useState({});
    const [fieldErrorsDocente, setFieldErrorsDocente] = useState({});
    const [fieldErrorsProgramas, setFieldErrorsProgramas] = useState({});
    const [fieldErrorsAdministrativo, setFieldErrorsAdministrativo] = useState({});
    const [fieldErrorsTitulo, setFieldErrorsTitulo] = useState({});
    const [fieldErrorsPassword, setFieldErrorsPassword] = useState({});

    const aplicarPerfil = useCallback((data) => {
        setPerfil(data);
        setDatos({
            nombre: data?.nombre ?? "",
            apellido: data?.apellido ?? "",
            telefono: data?.telefono ?? "",
        });
        setDocente({
            codigoDocente: data?.codigoDocente ?? "",
            tipoContrato: data?.tipoContratoDocente ?? "",
        });
        setProgramas(programasDesdePerfil(data?.programas));
        setAdministrativo({
            cargo: data?.cargo ?? "",
            dependencia: data?.dependencia ?? "",
        });
    }, []);

    const fetchPerfil = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMiPerfil();
            aplicarPerfil(data);
        } catch (e) {
            setError(getApiErrorMessage(e, "No se pudo cargar el perfil"));
        } finally {
            setLoading(false);
        }
    }, [aplicarPerfil]);

    useEffect(() => { fetchPerfil(); }, [fetchPerfil]);

    const onDatosChange = ({ target: { name, value } }) => {
        setDatos((prev) => ({ ...prev, [name]: value }));
        if (fieldErrorsDatos[name]) {
            setFieldErrorsDatos((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const onDocenteChange = ({ target: { name, value } }) => {
        setDocente((prev) => ({ ...prev, [name]: value }));
        if (fieldErrorsDocente[name]) {
            setFieldErrorsDocente((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const onAdministrativoChange = ({ target: { name, value } }) => {
        setAdministrativo((prev) => ({ ...prev, [name]: value }));
        if (fieldErrorsAdministrativo[name]) {
            setFieldErrorsAdministrativo((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const onProgramaChange = (index, field, value, extraFields = {}) => {
        setProgramas((prev) => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                [field]: value,
                ...extraFields,
                ...(field === "facultadId" ? { programaId: "", programaNombre: "" } : {}),
            };
            return next;
        });
        setFieldErrorsProgramas((prev) => {
            const next = { ...prev };
            delete next[`programas.${index}.${field}`];
            if (field === "facultadId") delete next[`programas.${index}.programaId`];
            delete next.programas;
            return next;
        });
    };

    const addPrograma = () =>
        setProgramas((prev) => [...prev, { ...programaInicial }]);

    const removePrograma = (index) =>
        setProgramas((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));

    const onTituloChange = ({ target: { name, value } }) => {
        setNuevoTitulo((prev) => ({ ...prev, [name]: value }));
        if (fieldErrorsTitulo[name]) {
            setFieldErrorsTitulo((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const onPasswordChange = ({ target: { name, value } }) => {
        setPasswords((prev) => ({ ...prev, [name]: value }));
        if (fieldErrorsPassword[name]) {
            setFieldErrorsPassword((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const guardarDatos = async (e) => {
        e.preventDefault();
        const errors = validarDatosPersonales(datos);
        if (Object.keys(errors).length) {
            setFieldErrorsDatos(errors);
            return false;
        }

        setSavingDatos(true);
        try {
            const actualizado = await actualizarMiPerfil({
                nombre: datos.nombre.trim(),
                apellido: datos.apellido.trim(),
                telefono: datos.telefono.trim() || null,
            });
            aplicarPerfil(actualizado);
            return true;
        } catch (err) {
            setError(getApiErrorMessage(err, "No se pudieron guardar los datos"));
            return false;
        } finally {
            setSavingDatos(false);
        }
    };

    const guardarProgramas = async (e) => {
        e.preventDefault();
        const errors = validarProgramasPerfil(programas);
        if (Object.keys(errors).length) {
            setFieldErrorsProgramas(errors);
            return false;
        }

        setSavingProgramas(true);
        try {
            const actualizado = await actualizarProgramasPerfil({
                programaIds: extraerProgramaIds(programas),
            });
            aplicarPerfil(actualizado);
            return true;
        } catch (err) {
            setError(getApiErrorMessage(err, "No se pudieron guardar los programas"));
            return false;
        } finally {
            setSavingProgramas(false);
        }
    };

    const guardarPerfilAdministrativo = async (e) => {
        e.preventDefault();
        const errors = validarPerfilAdministrativo(administrativo);
        if (Object.keys(errors).length) {
            setFieldErrorsAdministrativo(errors);
            return false;
        }

        setSavingAdministrativo(true);
        try {
            const actualizado = await actualizarPerfilAdministrativo({
                cargo: administrativo.cargo.trim(),
                dependencia: administrativo.dependencia.trim(),
            });
            aplicarPerfil(actualizado);
            return true;
        } catch (err) {
            setError(getApiErrorMessage(err, "No se pudo actualizar el perfil administrativo"));
            return false;
        } finally {
            setSavingAdministrativo(false);
        }
    };

    const guardarPerfilDocente = async (e) => {
        e.preventDefault();
        const requiereCodigo = !perfil?.codigoDocente?.trim();
        const errors = validarPerfilDocente(docente, { requiereCodigo });
        if (Object.keys(errors).length) {
            setFieldErrorsDocente(errors);
            return false;
        }

        setSavingDocente(true);
        try {
            const payload = {
                tipoContrato: docente.tipoContrato.trim(),
            };
            if (requiereCodigo) {
                payload.codigoDocente = docente.codigoDocente.trim();
            }
            const actualizado = await actualizarPerfilDocente(payload);
            aplicarPerfil(actualizado);
            return true;
        } catch (err) {
            setError(getApiErrorMessage(err, "No se pudo actualizar el perfil docente"));
            return false;
        } finally {
            setSavingDocente(false);
        }
    };

    const agregarTitulo = async (e) => {
        e.preventDefault();
        const errors = validarTituloAcademico(nuevoTitulo);
        if (Object.keys(errors).length) {
            setFieldErrorsTitulo(errors);
            return false;
        }

        setSavingTitulo(true);
        try {
            const actualizado = await agregarTituloPerfil({
                titulo: nuevoTitulo.titulo.trim(),
                nivel: nuevoTitulo.nivel,
                institucion: nuevoTitulo.institucion.trim(),
                fechaObtencion: nuevoTitulo.fechaObtencion || null,
                pais: nuevoTitulo.pais.trim() || null,
            });
            aplicarPerfil(actualizado);
            setNuevoTitulo(tituloInicial);
            setFieldErrorsTitulo({});
            return true;
        } catch (err) {
            setError(getApiErrorMessage(err, "No se pudo añadir el título"));
            return false;
        } finally {
            setSavingTitulo(false);
        }
    };

    const eliminarTitulo = async (tituloId) => {
        setDeletingTituloId(tituloId);
        try {
            const actualizado = await eliminarTituloPerfil(tituloId);
            aplicarPerfil(actualizado);
            return true;
        } catch (err) {
            setError(getApiErrorMessage(err, "No se pudo eliminar el título"));
            return false;
        } finally {
            setDeletingTituloId(null);
        }
    };

    const guardarPassword = async (e) => {
        e.preventDefault();
        const errors = validarCambioPassword(passwords);
        if (Object.keys(errors).length) {
            setFieldErrorsPassword(errors);
            return false;
        }

        setSavingPassword(true);
        try {
            await cambiarPassword({
                passwordActual: passwords.passwordActual,
                passwordNuevo: passwords.passwordNuevo,
            });
            setPasswords(passwordInicial);
            setFieldErrorsPassword({});
            return true;
        } catch (err) {
            setError(getApiErrorMessage(err, "No se pudo cambiar la contraseña"));
            return false;
        } finally {
            setSavingPassword(false);
        }
    };

    return {
        perfil,
        datos,
        docente,
        administrativo,
        programas,
        nuevoTitulo,
        passwords,
        loading,
        savingDatos,
        savingDocente,
        savingProgramas,
        savingAdministrativo,
        savingTitulo,
        deletingTituloId,
        savingPassword,
        error,
        fieldErrorsDatos,
        fieldErrorsDocente,
        fieldErrorsProgramas,
        fieldErrorsAdministrativo,
        fieldErrorsTitulo,
        fieldErrorsPassword,
        onDatosChange,
        onDocenteChange,
        onAdministrativoChange,
        onProgramaChange,
        addPrograma,
        removePrograma,
        onTituloChange,
        onPasswordChange,
        guardarDatos,
        guardarPerfilDocente,
        guardarProgramas,
        guardarPerfilAdministrativo,
        agregarTitulo,
        eliminarTitulo,
        guardarPassword,
        refetch: fetchPerfil,
        clearError: () => setError(null),
    };
};
