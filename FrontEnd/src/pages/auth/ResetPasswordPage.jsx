import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { restablecerPassword } from "../../services/authService";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { InstitutionalPanel } from "../../components/ui/InstitutionalPanel";
import { FormBanner } from "../../components/ui/FormBanner";
import { FieldError } from "../../components/ui/FieldError";
import { inputMd, inputError, labelBold } from "../../components/ui/themeTokens";
import {
    validateResetPasswordForm,
    resolvePasswordResetApiError,
} from "./passwordResetValidation";
import { AuthBackToPublicLink } from "./components/AuthBackToPublicLink";

const initialForm = { codigo: "", passwordNuevo: "", passwordConfirmacion: "" };

export const ResetPasswordPage = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email ?? "";

    const [form, setForm] = useState(initialForm);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [loading, setLoading] = useState(false);

    const onInputChange = ({ target: { name, value } }) => {
        const nextValue = name === "codigo" ? value.replace(/\D/g, "").slice(0, 6) : value;
        setForm((prev) => ({ ...prev, [name]: nextValue }));
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        if (formError) setFormError("");
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const errors = validateResetPasswordForm({ email, ...form });
        if (Object.keys(errors).length) {
            setFieldErrors(errors);
            setFormError("");
            return;
        }

        setFieldErrors({});
        setFormError("");
        setLoading(true);

        try {
            await restablecerPassword({
                email,
                codigo: form.codigo,
                passwordNuevo: form.passwordNuevo,
                passwordConfirmacion: form.passwordConfirmacion,
            });
            toast.success("Tu contraseña fue actualizada. Ya puedes iniciar sesión.");
            navigate("/login", { replace: true });
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

    if (!email) {
        return (
            <div className="min-h-screen flex font-sans">
                <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-10 py-12 lg:px-16">
                    <FormBanner variant="error">
                        Primero solicita un código desde la pantalla de recuperación de contraseña.
                    </FormBanner>
                    <Link
                        to="/forgot-password"
                        className="inline-block mt-4 text-sm text-[#A43D29] font-bold hover:underline"
                    >
                        Solicitar código
                    </Link>
                    <AuthBackToPublicLink className="mt-6" />
                </div>
                <InstitutionalPanel side="right" />
            </div>
        );
    }

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

                <h1 className="text-[#EC7A21] text-2xl font-bold mb-2">Nueva contraseña</h1>
                <p className="text-gray-400 text-sm mb-2">
                    Ingresa el código de 6 dígitos enviado a <span className="font-semibold">{email}</span>.
                </p>
                <p className="text-gray-400 text-xs mb-8">El código expira en 30 minutos.</p>

                <form onSubmit={onSubmit} noValidate className="space-y-4">
                    <div>
                        <label htmlFor="codigo" className={labelBold}>
                            Código de verificación
                        </label>
                        <input
                            id="codigo"
                            name="codigo"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            value={form.codigo}
                            onChange={onInputChange}
                            placeholder="000000"
                            maxLength={6}
                            aria-invalid={!!fieldErrors.codigo || undefined}
                            className={`${inputMd} tracking-[0.3em] text-center font-bold ${fieldErrors.codigo ? inputError : ""}`}
                        />
                        <FieldError message={fieldErrors.codigo} />
                    </div>

                    <div>
                        <label htmlFor="passwordNuevo" className={labelBold}>
                            Nueva contraseña
                        </label>
                        <PasswordInput
                            id="passwordNuevo"
                            name="passwordNuevo"
                            value={form.passwordNuevo}
                            onChange={onInputChange}
                            autoComplete="new-password"
                            hasError={!!fieldErrors.passwordNuevo}
                        />
                        <FieldError message={fieldErrors.passwordNuevo} />
                    </div>

                    <div>
                        <label htmlFor="passwordConfirmacion" className={labelBold}>
                            Confirmar contraseña
                        </label>
                        <PasswordInput
                            id="passwordConfirmacion"
                            name="passwordConfirmacion"
                            value={form.passwordConfirmacion}
                            onChange={onInputChange}
                            autoComplete="new-password"
                            hasError={!!fieldErrors.passwordConfirmacion}
                        />
                        <FieldError message={fieldErrors.passwordConfirmacion} />
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
                        Guardar contraseña
                    </LoadingButton>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    <Link to="/forgot-password" className="text-[#A43D29] font-bold hover:underline">
                        Solicitar otro código
                    </Link>
                    {" · "}
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
