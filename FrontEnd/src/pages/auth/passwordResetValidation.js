const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INSTITUTIONAL_EMAIL_SUFFIX = "@unicartagena.edu.co";

export const validateForgotPasswordEmail = (email) => {
    const errors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        errors.email = "El correo electrónico es obligatorio";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
        errors.email = "Ingresa un correo electrónico válido";
    } else if (!trimmedEmail.toLowerCase().endsWith(INSTITUTIONAL_EMAIL_SUFFIX)) {
        errors.email = "Debes usar tu correo institucional";
    }

    return errors;
};

export const validateResetPasswordForm = ({
    email,
    codigo,
    passwordNuevo,
    passwordConfirmacion,
}) => {
    const errors = {};

    if (!email?.trim()) {
        errors.email = "El correo electrónico es obligatorio";
    }

    if (!codigo) {
        errors.codigo = "El código es obligatorio";
    } else if (!/^\d{6}$/.test(codigo)) {
        errors.codigo = "El código debe tener 6 dígitos";
    }

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

export const resolvePasswordResetApiError = (err) => {
    const status = err?.response?.status;
    const message = err?.response?.data?.error ?? err?.response?.data?.message;

    if (status >= 500 || !err?.response) {
        return { code: "SERVER_ERROR" };
    }

    if (status === 429) {
        return {
            code: "RATE_LIMIT",
            message:
                message ??
                "Has agotado los intentos para solicitar un código de restablecimiento. Podrás volver a intentarlo en una hora.",
        };
    }

    return {
        code: "FORM_ERROR",
        message: message ?? "Ocurrió un error. Intenta de nuevo.",
    };
};
