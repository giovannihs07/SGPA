import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { InstitutionalPanel } from "../../components/ui/InstitutionalPanel";
import { MobileLogo } from "../../components/ui/MobileLogo";

const initialForm = { email: '', password: '' };

export const LoginPage = () => {
    const { handlerLogin } = useContext(AuthContext);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);

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
        <div className="min-h-screen bg-[#f5f3ee] flex">

            <InstitutionalPanel />

            <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
                <div className="w-full max-w-md">

                    <MobileLogo />

                    <h2 className="text-2xl font-bold text-[#003366] mb-1">Iniciar sesión</h2>
                    <p className="text-gray-500 text-sm mb-8">Ingresa con tu correo institucional</p>

                    <form onSubmit={onSubmit} noValidate className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onInputChange}
                                placeholder="usuario@unicartagena.edu.co"
                                autoComplete="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Contraseña
                            </label>
                            <PasswordInput
                                name="password"
                                value={password}
                                onChange={onInputChange}
                            />
                        </div>

                        <LoadingButton
                            loading={loading}
                            disabled={!email || !password}
                            className="w-full bg-[#003366] hover:bg-[#00264d] text-white"
                        >
                            Ingresar
                        </LoadingButton>

                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        ¿No tienes cuenta?{' '}
                        <Link to="/register" className="text-[#003366] font-medium hover:underline">
                            Regístrate aquí
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};
