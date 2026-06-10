import { ROLE_LABELS, getEstadoUsuarioConfig } from "../superAdmin/superAdminHelpers";

export const etiquetasRoles = (roles) => {
    if (!roles?.length) return "—";
    return [...roles]
        .map((r) => ROLE_LABELS[r] ?? r)
        .join(", ");
};

export const etiquetaEstado = (estado) =>
    getEstadoUsuarioConfig(estado).label;

export const validarDatosPersonales = ({ nombre, apellido }) => {
    const errors = {};
    if (!nombre?.trim()) errors.nombre = "El nombre es obligatorio";
    if (!apellido?.trim()) errors.apellido = "El apellido es obligatorio";
    return errors;
};

export const tienePerfilDocente = (perfil) => perfil?.docenteId != null;

export const tienePerfilAdministrativo = (perfil) => perfil?.administrativoId != null;

export const validarPerfilAdministrativo = ({ cargo, dependencia }) => {
    const errors = {};
    if (!cargo?.trim()) errors.cargo = "Selecciona un cargo";
    if (!dependencia?.trim()) errors.dependencia = "Selecciona una dependencia";
    return errors;
};

const programaVacio = () => ({
    facultadId: "",
    programaId: "",
    facultadNombre: "",
    programaNombre: "",
});

export const programasDesdePerfil = (programas) => {
    const lista = programas ? [...programas] : [];
    if (!lista.length) return [programaVacio()];
    return lista.map((p) => ({
        facultadId: p.facultadId ?? "",
        programaId: p.id ?? "",
        facultadNombre: p.facultadNombre ?? "",
        programaNombre: p.nombre ?? "",
    }));
};

export const extraerProgramaIds = (programas) =>
    programas
        .map((p) => Number(p.programaId))
        .filter((id) => !Number.isNaN(id) && id > 0);

export const validarProgramasPerfil = (programas) => {
    const errors = {};
    const ids = [];

    programas.forEach((p, i) => {
        if (!p.facultadId) {
            errors[`programas.${i}.facultadId`] = "Selecciona una facultad";
        }
        if (!p.programaId) {
            errors[`programas.${i}.programaId`] = "Selecciona un programa";
        } else {
            const id = Number(p.programaId);
            if (ids.includes(id)) {
                errors[`programas.${i}.programaId`] = "Este programa ya está en la lista";
            } else {
                ids.push(id);
            }
        }
    });

    if (ids.length === 0) {
        errors.programas = "Debes tener al menos un programa asignado";
    }

    return errors;
};

export const formatearProgramas = (programas) => {
    const lista = programas ? [...programas] : [];
    if (!lista.length) return [];
    return lista.map((p) => ({
        id: p.id,
        etiqueta: [p.facultadNombre, p.nombre].filter(Boolean).join(" — ") || p.nombre || "—",
    }));
};

export const validarPerfilDocente = ({ tipoContrato }) => {
    const errors = {};
    if (!tipoContrato?.trim()) errors.tipoContrato = "El tipo de contrato es obligatorio";
    return errors;
};

export const validarTituloAcademico = (titulo) => {
    const errors = {};
    if (!titulo?.titulo?.trim()) errors.titulo = "El título es obligatorio";
    if (!titulo?.nivel?.trim()) errors.nivel = "El nivel es obligatorio";
    if (!titulo?.institucion?.trim()) errors.institucion = "La institución es obligatoria";
    return errors;
};

export const validarCambioPassword = ({ passwordActual, passwordNuevo, passwordConfirmacion }) => {
    const errors = {};
    if (!passwordActual) errors.passwordActual = "La contraseña actual es obligatoria";
    if (!passwordNuevo) {
        errors.passwordNuevo = "La nueva contraseña es obligatoria";
    } else if (passwordNuevo.length < 8) {
        errors.passwordNuevo = "Debe tener al menos 8 caracteres";
    }
    if (!passwordConfirmacion) {
        errors.passwordConfirmacion = "Confirma la nueva contraseña";
    } else if (passwordNuevo && passwordConfirmacion !== passwordNuevo) {
        errors.passwordConfirmacion = "Las contraseñas no coinciden";
    }
    return errors;
};
