import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { InstitutionalPanel } from "../../components/ui/InstitutionalPanel";
import { FormBanner } from "../../components/ui/FormBanner";
import { FieldError } from "../../components/ui/FieldError";
import { inputMd, inputError, labelBold } from "../../components/ui/themeTokens";

const initialForm = { email: "", password: "" };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INSTITUTIONAL_EMAIL_SUFFIX = "@unicartagena.edu.co";

const validateForm = ({ email, password }) => {
    const errors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
        errors.email = "El correo electrónico es obligatorio";
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
        errors.email = "Ingresa un correo electrónico válido";
    } else if (!trimmedEmail.toLowerCase().endsWith(INSTITUTIONAL_EMAIL_SUFFIX)) {
        errors.email = "Debes usar tu correo institucional";
    }

    if (!password) {
        errors.password = "La contraseña es obligatoria";
    }

    return errors;
};

export const LoginPage = () => {
    const { handlerLogin } = useContext(AuthContext);
    const { toast } = useToast();
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [authError, setAuthError] = useState("");

    const { email, password } = form;

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setForm({ ...form, [name]: value });

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        if (authError) setAuthError("");
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm({ email, password });
        if (Object.keys(errors).length) {
            setFieldErrors(errors);
            setAuthError("");
            return;
        }

        setFieldErrors({});
        setAuthError("");
        setLoading(true);

        const result = await handlerLogin({ email, password });
        setLoading(false);

        if (result.ok) {
            setForm(initialForm);
            return;
        }

        if (result.code === "INVALID_CREDENTIALS" || result.code === "FORBIDDEN") {
            setAuthError(result.message);
            return;
        }

        if (result.code === "SERVER_ERROR") {
            toast.error("Ocurrió un error en el servidor. Intenta de nuevo más tarde.");
        }
    };

    return (
        <div className="min-h-screen flex font-sans">

            {/* Panel izquierdo — formulario */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-10 py-12 lg:px-16 overflow-y-auto">

                {/* Logo universidad */}
                <div className="mb-6 flex flex-col items-start gap-1">
                    <img
                        src="/logo-udc.png"
                        alt="Universidad de Cartagena"
                        className="h-20 object-contain"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                    {/* Fallback si no hay imagen */}
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

                {/* Título */}
                <h1 className="text-[#EC7A21] text-2xl font-bold mb-2">Iniciar sesión</h1>
                <p className="text-gray-400 text-sm mb-8">Ingresa con tu correo institucional.</p>

                <form onSubmit={onSubmit} noValidate className="space-y-4">

                    {/* Email */}
                    <div>
                        <label htmlFor="login-email" className={labelBold}>
                            Correo electrónico
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={onInputChange}
                            placeholder="usuario@unicartagena.edu.co"
                            autoComplete="email"
                            aria-invalid={!!fieldErrors.email || undefined}
                            aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
                            className={`${inputMd} ${fieldErrors.email ? inputError : ""}`}
                        />
                        <FieldError id="login-email-error" message={fieldErrors.email} />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label htmlFor="login-password" className={labelBold}>
                            Contraseña
                        </label>
                        <PasswordInput
                            id="login-password"
                            name="password"
                            value={password}
                            onChange={onInputChange}
                            hasError={!!fieldErrors.password}
                            describedBy={fieldErrors.password ? "login-password-error" : undefined}
                        />
                        <FieldError id="login-password-error" message={fieldErrors.password} />
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-xs text-[#A43D29] font-semibold hover:underline">
                            Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {authError && (
                        <FormBanner variant="error" onClose={() => setAuthError("")}>
                            {authError}
                        </FormBanner>
                    )}

                    {/* Botón */}
                    <LoadingButton
                        loading={loading}
                        disabled={loading}
                        className="w-full bg-[#EC7A21] hover:bg-[#CF620C] text-white text-base font-bold py-2.5 rounded-md shadow-[5px_2px_10px_3px_#0000000d] border-2 border-[#C8963E]"
                    >
                        Ingresar
                    </LoadingButton>

                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-[#A43D29] font-bold hover:underline">
                        Regístrese
                    </Link>
                </p>
            </div>

            {/* Panel derecho — institucional */}
            <InstitutionalPanel side="right" />

        </div>
    );
};
