import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { InstitutionalPanel } from "../../components/ui/InstitutionalPanel";

const initialForm = { email: "", password: "" };

export const LoginPage = () => {
    const { handlerLogin } = useContext(AuthContext);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [remember, setRemember] = useState(false);

    const { email, password } = form;

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setForm({ ...form, [name]: value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;
        setLoading(true);
        await handlerLogin({ email, password });
        setLoading(false);
        setForm(initialForm);
    };

    return (
        <div className="min-h-screen flex font-sans">

            {/* Panel izquierdo — formulario */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-10 py-12 lg:px-16">

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
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onInputChange}
                            placeholder="usuario@unicartagena.edu.co"
                            autoComplete="email"
                            className="w-full px-4 py-2 pr-11 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EFB357] focus:border-transparent transition"
                        />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <PasswordInput
                            name="password"
                            value={password}
                            onChange={onInputChange}
                        />
                    </div>

                    {/* Recordarme / Olvidaste contraseña */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <div
                                onClick={() => setRemember(v => !v)}
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition ${remember ? 'bg-[#EFB357] border-[#EFB357]' : 'border-gray-300 bg-white'}`}
                            >
                                {remember && (
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-xs text-gray-500">Recordarme</span>
                        </label>
                        <Link to="/forgot-password" className="text-xs text-[#A43D29] font-semibold hover:underline">
                            Olvidaste tu contraseña?
                        </Link>
                    </div>

                    {/* Botón */}
                    <LoadingButton
                        loading={loading}
                        disabled={!email || !password}
                        className="w-full bg-[#EC7A21] hover:bg-[#CF620C] text-white text-base font-bold py-2.5 rounded-md shadow-[5px_2px_10px_3px_#0000000d] border-2 border-[#C8963E]"
                    >
                        Ingresar
                    </LoadingButton>

                </form>

                <p className="text-center text-xs text-gray-400 mt-4">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-[#A43D29] font-bold hover:underline">
                        Regístrate aquí
                    </Link>
                </p>
            </div>

            {/* Panel derecho — institucional */}
            <InstitutionalPanel side="right" />

        </div>
    );
};
