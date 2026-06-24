export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const INSTITUTIONAL_EMAIL_SUFFIX = "@unicartagena.edu.co";
const DIGITS_ONLY = /^\d+$/;

export const validateStep1 = (form) => {
    const errors = {};

    if (form.userTypes.length === 0) {
        errors.userTypes = "Selecciona al menos un tipo de usuario";
    }
    if (!form.firstName.trim()) errors.firstName = "Los nombres son obligatorios";
    if (!form.lastName.trim()) errors.lastName = "Los apellidos son obligatorios";
    if (!form.documentId.trim()) {
        errors.documentId = "La cédula es obligatoria";
    } else if (!DIGITS_ONLY.test(form.documentId.trim())) {
        errors.documentId = "La cédula solo puede contener números";
    }
    if (!form.phone.trim()) {
        errors.phone = "El teléfono es obligatorio";
    } else if (!DIGITS_ONLY.test(form.phone.trim())) {
        errors.phone = "El teléfono solo puede contener números";
    }

    return errors;
};

export const validateStep2 = (form) => {
    const errors = {};
    const isDocente = form.userTypes.includes("docente");
    const isAdministrativo = form.userTypes.includes("administrativo");

    if (isDocente) {
        if (!form.codigoDocente.trim()) errors.codigoDocente = "El código docente es obligatorio";
        if (!form.tipoContrato) errors.tipoContrato = "Selecciona un tipo de contrato";

        form.programas.forEach((p, i) => {
            if (!p.facultadId) errors[`programas.${i}.facultadId`] = "Selecciona una facultad";
            if (!p.programaId) errors[`programas.${i}.programaId`] = "Selecciona un programa";
        });
    }

    if (isAdministrativo) {
        if (!form.cargo) errors.cargo = "Selecciona un cargo";
        if (!form.dependencia) errors.dependencia = "Selecciona una dependencia";
    }

    return errors;
};

export const validateStep3 = (form) => {
    const errors = {};

    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
        errors.email = "El correo electrónico es obligatorio";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
        errors.email = "Ingresa un correo electrónico válido";
    } else if (!trimmedEmail.toLowerCase().endsWith(INSTITUTIONAL_EMAIL_SUFFIX)) {
        errors.email = "Debes usar tu correo institucional";
    }

    if (!form.password) {
        errors.password = "La contraseña es obligatoria";
    }
    if (!form.confirmPassword) {
        errors.confirmPassword = "Confirma tu contraseña";
    } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = "Las contraseñas no coinciden";
    }

    return errors;
};

export const validateRegisterStep = (form, step) => {
    if (step === 1) return validateStep1(form);
    if (step === 2) return validateStep2(form);
    return validateStep3(form);
};

export const validateRegisterForm = (form) => ({
    ...validateStep1(form),
    ...validateStep2(form),
    ...validateStep3(form),
});

export const resolveRegisterApiError = (err) => {
    const status = err?.response?.status;
    const message = err?.response?.data?.message;

    if (status >= 500 || !err?.response) {
        return { code: "SERVER_ERROR" };
    }

    return {
        code: "FORM_ERROR",
        message: message ?? "Ocurrió un error al registrar. Verifica los datos e intenta de nuevo.",
    };
};
