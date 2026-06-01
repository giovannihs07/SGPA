import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import { initialForm } from "../registerConfig";
import { validateRegisterForm, validateRegisterStep, resolveRegisterApiError } from "../registerValidation";
import { REGISTER_TOTAL_STEPS } from "../registerConfig";
import {
    registerDocente,
    registerAdministrativo,
    registerDocenteAdmin,
} from "../../../services/authService";

const toDocenteDTO = (form) => ({
    nombre:        form.firstName.trim(),
    apellido:      form.lastName.trim(),
    cedula:        form.documentId.trim(),
    telefono:      form.phone.trim(),
    email:         form.email.trim(),
    password:      form.password,
    codigoDocente: form.codigoDocente.trim(),
    tipoContrato:  form.tipoContrato,
    programaIds:   form.programas.map(p => p.programaId),
    titulos:       form.titulos.map(t => ({
        titulo:         t.titulo.trim(),
        nivel:          t.nivel,
        institucion:    t.institucion.trim(),
        fechaObtencion: t.fechaObtencion,
        pais:           t.pais.trim(),
    })),
});

const toAdministrativoDTO = (form) => ({
    nombre:      form.firstName.trim(),
    apellido:    form.lastName.trim(),
    cedula:      form.documentId.trim(),
    telefono:    form.phone.trim(),
    email:       form.email.trim(),
    password:    form.password,
    cargo:       form.cargo,
    dependencia: form.dependencia,
});

const toDocenteAdminDTO = (form) => ({
    docente: toDocenteDTO(form),
    administrativo: {
        cargo:       form.cargo,
        dependencia: form.dependencia,
    },
});

const clearNestedFieldError = (errors, key) => {
    if (!errors[key]) return errors;
    const next = { ...errors };
    delete next[key];
    return next;
};

export const useRegisterForm = () => {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const { toast } = useToast();

    const isDocente        = form.userTypes.includes("docente");
    const isAdministrativo = form.userTypes.includes("administrativo");
    const isAmbos          = isDocente && isAdministrativo;

    const onInputChange = ({ target: { name, value } }) => {
        setForm(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => clearNestedFieldError(prev, name));
        if (formError) setFormError("");
    };

    const toggleUserType = (id) => {
        setForm(prev => {
            const next = prev.userTypes.includes(id)
                ? prev.userTypes.filter(t => t !== id)
                : [...prev.userTypes, id];
            const nd = next.includes("docente");
            const na = next.includes("administrativo");
            return {
                ...prev,
                userTypes:     next,
                codigoDocente: nd ? prev.codigoDocente : "",
                tipoContrato:  nd ? prev.tipoContrato : "",
                programas:     nd ? prev.programas     : [{ facultadId: "", programaId: "", facultadNombre: "", programaNombre: "" }],
                titulos:       nd ? prev.titulos        : [{ titulo: "", nivel: "", institucion: "", fechaObtencion: "", pais: "" }],
                cargo:         na ? prev.cargo          : "",
                dependencia:   na ? prev.dependencia    : "",
            };
        });
        setFieldErrors(prev => clearNestedFieldError(prev, "userTypes"));
        if (formError) setFormError("");
    };

    const onProgramaChange = (i, field, value, extraFields = {}) => {
        setForm(prev => {
            const next = [...prev.programas];
            next[i] = {
                ...next[i],
                [field]: value,
                ...extraFields,
                ...(field === "facultadId" ? { programaId: "", programaNombre: "" } : {}),
            };
            return { ...prev, programas: next };
        });
        setFieldErrors(prev => {
            const next = { ...prev };
            delete next[`programas.${i}.${field}`];
            if (field === "facultadId") delete next[`programas.${i}.programaId`];
            return next;
        });
        if (formError) setFormError("");
    };

    const addPrograma = () =>
        setForm(prev => ({
            ...prev,
            programas: [...prev.programas, { facultadId: "", programaId: "", facultadNombre: "", programaNombre: "" }],
        }));

    const removePrograma = (i) =>
        setForm(prev => ({
            ...prev,
            programas: prev.programas.filter((_, idx) => idx !== i),
        }));

    const onTituloChange = (i, field, value) => {
        setForm(prev => {
            const next = [...prev.titulos];
            next[i] = { ...next[i], [field]: value };
            return { ...prev, titulos: next };
        });
        setFieldErrors(prev => clearNestedFieldError(prev, `titulos.${i}.${field}`));
        if (formError) setFormError("");
    };

    const addTitulo = () =>
        setForm(prev => ({
            ...prev,
            titulos: [...prev.titulos, { titulo: "", nivel: "", institucion: "", fechaObtencion: "", pais: "" }],
        }));

    const removeTitulo = (i) =>
        setForm(prev => ({
            ...prev,
            titulos: prev.titulos.filter((_, idx) => idx !== i),
        }));

    const goNext = () => {
        const errors = validateRegisterStep(form, step);
        if (Object.keys(errors).length) {
            setFieldErrors(errors);
            setFormError("");
            return false;
        }
        setFieldErrors({});
        setFormError("");
        setStep(prev => Math.min(prev + 1, REGISTER_TOTAL_STEPS));
        return true;
    };

    const goBack = () => {
        setFieldErrors({});
        setFormError("");
        setStep(prev => Math.max(prev - 1, 1));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const errors = validateRegisterForm(form);
        if (Object.keys(errors).length) {
            setFieldErrors(errors);
            setFormError("");
            return;
        }

        setFieldErrors({});
        setFormError("");
        setLoading(true);

        try {
            if (isAmbos) {
                await registerDocenteAdmin(toDocenteAdminDTO(form));
            } else if (isDocente) {
                await registerDocente(toDocenteDTO(form));
            } else {
                await registerAdministrativo(toAdministrativoDTO(form));
            }
            toast.success("¡Cuenta creada! Ya puedes iniciar sesión.");
            navigate("/login");
        } catch (err) {
            const result = resolveRegisterApiError(err);
            if (result.code === "SERVER_ERROR") {
                toast.error("Ocurrió un error en el servidor. Intenta de nuevo más tarde.");
            } else {
                setFormError(result.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        step,
        fieldErrors,
        formError,
        setFormError,
        isDocente,
        isAdministrativo,
        onInputChange,
        toggleUserType,
        onProgramaChange, addPrograma, removePrograma,
        onTituloChange,   addTitulo,   removeTitulo,
        goNext,
        goBack,
        onSubmit,
    };
};
