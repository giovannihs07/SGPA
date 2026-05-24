import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialForm } from "../registerConfig";
import {
    registerDocente,
    registerAdministrativo,
    registerDocenteAdmin,
} from "../../../services/authService";
import { notifySuccess, notifyError } from "../../../utils/notify";

// Transformadores form → DTO (json) que el backend espera, con limpieza básica de strings.

const toDocenteDTO = (form) => ({
    nombre:        form.firstName.trim(),
    apellido:      form.lastName.trim(),
    cedula:        form.documentId.trim(),
    telefono:      form.phone.trim(),
    email:         form.email.trim(),
    password:      form.password,
    codigoDocente: form.codigoDocente.trim(),
    tipoContrato:  form.tipoContrato,
    // El backend espera Set<Long> de IDs de programa
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
    nombre:     form.firstName.trim(),
    apellido:   form.lastName.trim(),
    cedula:     form.documentId.trim(),
    telefono:   form.phone.trim(),
    email:      form.email.trim(),
    password:   form.password,
    cargo:      form.cargo,
    dependencia: form.dependencia,
});

const toDocenteAdminDTO = (form) => ({
    docente: toDocenteDTO(form),
    administrativo: {
        cargo:       form.cargo,
        dependencia: form.dependencia,
    },
});

// Hook principal para manejar el estado y lógica del formulario de registro, incluyendo validación y submit.

export const useRegisterForm = () => {
    const [form, setForm]       = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const navigate              = useNavigate();

    const isDocente        = form.userTypes.includes("docente");
    const isAdministrativo = form.userTypes.includes("administrativo");
    const isAmbos          = isDocente && isAdministrativo;

    // Handler genérico

    const onInputChange = ({ target: { name, value } }) =>
        setForm(prev => ({ ...prev, [name]: value }));

    // Tipo de usuario (checkboxes) — al cambiar, limpiar campos específicos si el tipo se desmarca

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
    };

    // Programas — cada programa necesita facultadId Y programaId (ID real del backend) para ser válido. Al cambiar facultad, resetear el programa seleccionado.

    const onProgramaChange = (i, field, value, extraFields = {}) =>
        setForm(prev => {
            const next = [...prev.programas];
            next[i] = {
                ...next[i],
                [field]: value,
                ...extraFields,
                // Al cambiar facultad, resetear el programa seleccionado
                ...(field === "facultadId" ? { programaId: "", programaNombre: "" } : {}),
            };
            return { ...prev, programas: next };
        });

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

    // Títulos — validación básica: ningún campo puede estar vacío. Al cambiar cualquier campo, actualizar el estado correspondiente.

    const onTituloChange = (i, field, value) =>
        setForm(prev => {
            const next = [...prev.titulos];
            next[i] = { ...next[i], [field]: value };
            return { ...prev, titulos: next };
        });

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

    // Validación general del formulario — se recalcula cada vez que cambia el form o los tipos de usuario. Para ser válido:
    // - Debe tener al menos un tipo de usuario seleccionado.
    // - Campos básicos (nombre, apellido, cédula, teléfono, email, password) no pueden estar vacíos.
    // - Password y confirmPassword deben coincidir.
    // - Si es docente: código docente no puede estar vacío, debe tener al menos un programa con facultadId y programaId válidos, y cada título debe tener todos sus campos completos.
    // - Si es administrativo: cargo y dependencia no pueden estar vacíos.

    const isValid = useMemo(() => {
        const { userTypes, firstName, lastName, documentId, phone, tipoContrato,
                email, password, confirmPassword, codigoDocente,
                programas, titulos, cargo, dependencia } = form;

        if (userTypes.length === 0) return false;
        if (!firstName.trim() || !lastName.trim()) return false;
        if (!documentId.trim() || !phone.trim()) return false;
        if (!email.trim() || !password || !confirmPassword) return false;
        if (password !== confirmPassword) return false;

        if (isDocente) {
            if (!codigoDocente.trim()) return false;
            if (!tipoContrato) return false;
            // Cada programa necesita facultadId Y programaId (ID real del backend)
            if (programas.some(p => !p.facultadId || !p.programaId)) return false;
            if (titulos.some(t =>
                !t.titulo.trim() || !t.nivel || !t.institucion.trim() ||
                !t.fechaObtencion || !t.pais.trim()
            )) return false;
        }
        if (isAdministrativo) {
            if (!cargo || !dependencia) return false;
        }
        return true;
    }, [form, isDocente, isAdministrativo]);

    // Submit — al enviar, validar el formulario. Si es válido, llamar al endpoint correspondiente según el tipo de usuario, mostrar notificación de éxito y redirigir a login. Si falla, mostrar notificación de error.

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        setLoading(true);

        // Para depuración: mostrar el payload que se enviará al backend
        const payload = isAmbos ? toDocenteAdminDTO(form)
            : isDocente ? toDocenteDTO(form)
            : toAdministrativoDTO(form);
        console.log("Payload docente:", JSON.stringify(payload, null, 2));

        try {
            if (isAmbos) {
                await registerDocenteAdmin(toDocenteAdminDTO(form));
            } else if (isDocente) {
                await registerDocente(toDocenteDTO(form));
            } else {
                await registerAdministrativo(toAdministrativoDTO(form));
            }
            await notifySuccess("¡Cuenta creada!", "Ya puedes iniciar sesión.");
            navigate("/login");
        } catch (err) {
            console.log("Error completo:", err?.response?.data); // Para depuración
            const msg = err?.response?.data?.message ?? "Ocurrió un error al registrar.";
            notifyError("Error al registrar", msg);
        } finally {
            setLoading(false);
        }
    };

    return {
        form,
        loading,
        isValid,
        isDocente,
        isAdministrativo,
        onInputChange,
        toggleUserType,
        onProgramaChange, addPrograma, removePrograma,
        onTituloChange,   addTitulo,   removeTitulo,
        onSubmit,
    };
};