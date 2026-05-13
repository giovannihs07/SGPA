import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosInstance from "../../services/axiosInstance";
import { InstitutionalPanel } from "../../components/ui/InstitutionalPanel";
import { MobileLogo } from "../../components/ui/MobileLogo";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { LoadingButton } from "../../components/ui/LoadingButton";

const ROLES = [
    {
        value: "DOCENTE",
        label: "Docente",
        description: "Registro y gestión de tu producción académica",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        value: "ESTUDIANTE",
        label: "Estudiante",
        description: "Consulta de materiales académicos publicados",
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
    },
];

const INITIAL = {
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "DOCENTE",
};

function PasswordStrength({ password }) {
    const checks = [
        { label: "8 caracteres", ok: password.length >= 8 },
        { label: "Mayúscula",    ok: /[A-Z]/.test(password) },
        { label: "Número",       ok: /\d/.test(password) },
        { label: "Símbolo",      ok: /[!@#$%^&*]/.test(password) },
    ];
    const score = checks.filter((c) => c.ok).length;
    const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

    if (!password) return null;

    return (
        <div className="mt-2">
            <div className="flex gap-1 mb-2">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-gray-200"}`} />
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
                {checks.map((c) => (
                    <span key={c.label} className={`text-xs flex items-center gap-1 ${c.ok ? "text-green-600" : "text-gray-400"}`}>
                        {c.ok ? "✓" : "○"} {c.label}
                    </span>
                ))}
            </div>
        </div>
    );
}

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [form, setForm]               = useState(INITIAL);
    const [loading, setLoading]         = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const { nombre, apellido, email, password, confirmPassword, rol } = form;

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const errors = {};
        if (!nombre.trim())    errors.nombre   = "El nombre es requerido.";
        if (!apellido.trim())  errors.apellido = "El apellido es requerido.";
        if (!email.trim())     errors.email    = "El correo es requerido.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            errors.email = "Ingresa un correo válido.";
        if (!password)         errors.password = "La contraseña es requerida.";
        else if (password.length < 8)
            errors.password = "Mínimo 8 caracteres.";
        if (password !== confirmPassword)
            errors.confirmPassword = "Las contraseñas no coinciden.";
        return errors;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        try {
            setLoading(true);
            const { confirmPassword: _, ...payload } = form;
            await axiosInstance.post("/auth/register", payload);
            Swal.fire("¡Registro exitoso!", "Ya puedes iniciar sesión.", "success");
            navigate("/login");
        } catch (err) {
            const msg = err.response?.data?.message;
            Swal.fire("Error al registrar", msg || "Intenta de nuevo.", "error");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-lg border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition ${
            fieldErrors[field]
                ? "border-red-300 bg-red-50 focus:ring-red-300"
                : "border-gray-200 bg-white focus:ring-[#003366]"
        }`;

    return (
        <div className="min-h-screen bg-[#f5f3ee] flex">
            <InstitutionalPanel />

            <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
                <div className="w-full max-w-lg py-8">
                    <MobileLogo />

                    <h2 className="text-2xl font-bold text-[#003366] mb-1">Crear cuenta</h2>
                    <p className="text-gray-500 text-sm mb-6">Completa tus datos para acceder al sistema</p>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

                        {/* Selector de rol */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de usuario</label>
                            <div className="grid grid-cols-2 gap-3">
                                {ROLES.map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setForm((p) => ({ ...p, rol: r.value }))}
                                        className={`flex flex-col items-start gap-1 p-3.5 rounded-lg border-2 text-left transition-all duration-200 ${
                                            rol === r.value
                                                ? "border-[#003366] bg-[#003366]/5"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <div className={rol === r.value ? "text-[#003366]" : "text-gray-400"}>{r.icon}</div>
                                        <span className={`text-sm font-semibold ${rol === r.value ? "text-[#003366]" : "text-gray-700"}`}>{r.label}</span>
                                        <span className="text-xs text-gray-400 leading-tight">{r.description}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={onSubmit} noValidate className="space-y-4">

                            {/* Nombre y Apellido */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                                    <input type="text" name="nombre" value={nombre} onChange={onInputChange}
                                        placeholder="Giovanni" autoComplete="given-name" className={inputClass("nombre")} />
                                    {fieldErrors.nombre && <p className="text-xs text-red-500 mt-1">{fieldErrors.nombre}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellido</label>
                                    <input type="text" name="apellido" value={apellido} onChange={onInputChange}
                                        placeholder="Hernández" autoComplete="family-name" className={inputClass("apellido")} />
                                    {fieldErrors.apellido && <p className="text-xs text-red-500 mt-1">{fieldErrors.apellido}</p>}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
                                <input type="email" name="email" value={email} onChange={onInputChange}
                                    placeholder="usuario@unicartagena.edu.co" autoComplete="email" className={inputClass("email")} />
                                {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
                                <PasswordInput
                                    name="password"
                                    value={password}
                                    onChange={onInputChange}
                                    placeholder="Mínimo 8 caracteres"
                                    autoComplete="new-password"
                                />
                                {fieldErrors.password && <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>}
                                <PasswordStrength password={password} />
                            </div>

                            {/* Confirmar contraseña */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
                                <PasswordInput
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={onInputChange}
                                    placeholder="Repite tu contraseña"
                                    autoComplete="new-password"
                                />
                                {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>}
                            </div>

                            <LoadingButton
                                loading={loading}
                                disabled={!nombre || !apellido || !email || !password || !confirmPassword}
                                className="w-full bg-[#003366] hover:bg-[#00264d] text-white mt-2"
                            >
                                Crear cuenta
                            </LoadingButton>
                        </form>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-5">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login" className="text-[#003366] font-medium hover:underline">Inicia sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

