import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { solicitarResetPassword } from "../../services/authService";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { InstitutionalPanel } from "../../components/ui/InstitutionalPanel";
import { FormBanner } from "../../components/ui/FormBanner";
import { FieldError } from "../../components/ui/FieldError";
import { inputMd, inputError, labelBold } from "../../components/ui/themeTokens";
import {
    validateForgotPasswordEmail,
    resolvePasswordResetApiError,
} from "./passwordResetValidation";
import { AuthBackToPublicLink } from "./components/AuthBackToPublicLink";

export const ForgotPasswordPage = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");

    const onInputChange = ({ target: { value } }) => {
        setEmail(value);
        if (fieldErrors.email) {
            setFieldErrors((prev) => ({ ...prev, email: undefined }));
        }
        if (formError) setFormError("");
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForgotPasswordEmail(email);
        if (Object.keys(errors).length) {
            setFieldErrors(errors);
            setFormError("");
            return;
        }

        setFieldErrors({});
        setFormError("");
        setLoading(true);

        const trimmedEmail = email.trim();

        try {
            await solicitarResetPassword(trimmedEmail);
            navigate("/reset-password", { state: { email: trimmedEmail } });
        } catch (err) {
            const result = resolvePasswordResetApiError(err);
            if (result.code === "SERVER_ERROR") {
                toast.error("Ocurrió un error en el servidor. Intenta de nuevo más tarde.");
            } else {
                setFormError(result.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex font-sans">
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-10 py-12 lg:px-16 overflow-y-auto">
                <div className="mb-6 flex flex-col items-start gap-1">
                    <img
                        src="/logo-udc.png"
                        alt="Universidad de Cartagena"
                        className="h-20 object-contain"
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                        }}
                    />
                    <div className="hidden flex-col items-start">
                        <div className="w-16 h-16 bg-[#ffc20e] rounded-lg flex items-center justify-center mb-2">
                            <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
                                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
                            </svg>
                        </div>
                        <span className="text-[#ffc20e] font-bold text-sm leading-tight">Universidad</span>
                        <span className="text-[#ffc20e] font-bold text-sm leading-tight">de Cartagena</span>
                        <span className="text-gray-400 text-xs">Fundada en 1827</span>
                    </div>
                </div>

                <h1 className="text-[#EC7A21] text-2xl font-bold mb-2">Recuperar contraseña</h1>
                <p className="text-gray-400 text-sm mb-8">
                    Ingresa tu correo institucional y te enviaremos un código de verificación.
                </p>

                <form onSubmit={onSubmit} noValidate className="space-y-4">
                    <div>
                        <label htmlFor="forgot-email" className={labelBold}>
                            Correo electrónico
                        </label>
                        <input
                            id="forgot-email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={onInputChange}
                            placeholder="usuario@unicartagena.edu.co"
                            autoComplete="email"
                            aria-invalid={!!fieldErrors.email || undefined}
                            aria-describedby={fieldErrors.email ? "forgot-email-error" : undefined}
                            className={`${inputMd} ${fieldErrors.email ? inputError : ""}`}
                        />
                        <FieldError id="forgot-email-error" message={fieldErrors.email} />
                    </div>

                    {formError && (
                        <FormBanner variant="error" onClose={() => setFormError("")}>
                            {formError}
                        </FormBanner>
                    )}

                    <LoadingButton
                        loading={loading}
                        disabled={loading}
                        className="w-full bg-[#EC7A21] hover:bg-[#CF620C] text-white text-base font-bold py-2.5 rounded-md shadow-[5px_2px_10px_3px_#0000000d] border-2 border-[#C8963E]"
                    >
                        Enviar código
                    </LoadingButton>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    <Link to="/login" className="text-[#A43D29] font-bold hover:underline">
                        Volver al inicio de sesión
                    </Link>
                </p>

                <AuthBackToPublicLink />
            </div>

            <InstitutionalPanel side="right" />
        </div>
    );
};
