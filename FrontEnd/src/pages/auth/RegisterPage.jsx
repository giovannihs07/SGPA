import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { InstitutionalPanel } from "../../components/ui/InstitutionalPanel";

const initialForm = {
    userTypes: [],
    firstName: "",
    lastName: "",
    documentId: "",
    phone: "",
    contractType: "",
    faculty: "",
    program: "",
    cargo: "",
    dependencia: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const userTypeOptions = [
    {
        id: "docente",
        title: "Docente",
        description: "Registro y gestión de producción académica",
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
        ),
    },
    {
        id: "administrativo",
        title: "Administrativo",
        description: "Gestión y supervisión del sistema",
        icon: (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 1C8.676 1 6 3.676 6 7s2.676 6 6 6 6-2.676 6-6-2.676-6-6-6zm0 14c-4.006 0-12 2.009-12 6v2h24v-2c0-3.991-7.994-6-12-6z" />
            </svg>
        ),
    },
];

const contractOptions = [
    "Docente de planta",
    "Docente ocasional",
    "Catedrático",
];

const cargoOptions = [
    "Administrativo",
    "Contratista",
    "Directivo",
    "Técnico",
    "Auxiliar administrativo",
];

const dependenciaOptions = [
    "Rectoría",
    "Vicerrectoría Académica",
    "Vicerrectoría Administrativa",
    "Secretaría General",
    "Bienestar Universitario",
    "Dirección de Investigaciones",
    "Oficina de Sistemas",
    "Oficina de Planeación",
];

const facultyOptions = [
    "Ingeniería",
    "Ciencias Sociales",
    "Ciencias Económicas",
    "Derecho",
    "Educación",
];

const programsByFaculty = {
    "Ingeniería": ["Ingeniería de Sistemas", "Ingeniería Civil", "Ingeniería Industrial"],
    "Ciencias Sociales": ["Trabajo Social", "Comunicación Social", "Sociología"],
    "Ciencias Económicas": ["Administración de Empresas", "Contaduría Pública", "Economía"],
    "Derecho": ["Derecho"],
    "Educación": ["Licenciatura en Matemáticas", "Licenciatura en Español", "Licenciatura en Educación Física"],
};

const inputClass =
    "w-full px-3 py-2 rounded-md border-2 border-[#cab4b4] bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#EFB357] transition shadow-[5px_2px_10px_3px_#0000000d]";

const labelClass = "block text-xs font-bold text-gray-700 mb-1.5";

const SelectWithArrow = ({ name, value, onChange, options, placeholder, disabled = false }) => (
    <div className="relative">
        <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${inputClass} appearance-none pr-10 ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : ""}`}
        >
            <option value="" disabled>{placeholder}</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    </div>
);

export const RegisterPage = () => {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);

    const {
        userTypes, firstName, lastName, documentId, phone,
        contractType, faculty, program, cargo, dependencia,
        email, password, confirmPassword,
    } = form;

    const isDocente = userTypes.includes("docente");
    const isAdministrativo = userTypes.includes("administrativo");
    const showDocenteFields = isDocente;
    const showAdminFields = isAdministrativo;

    const availablePrograms = faculty ? (programsByFaculty[faculty] || []) : [];

    const isValid = useMemo(() => {
        if (userTypes.length === 0) return false;
        if (!firstName.trim() || !lastName.trim()) return false;
        if (!documentId.trim() || !phone.trim()) return false;
        if (!email.trim() || !password || !confirmPassword) return false;
        if (password !== confirmPassword) return false;

        if (isDocente) {
            if (!contractType || !faculty || !program) return false;
        }
        if (isAdministrativo) {
            if (!cargo || !dependencia) return false;
        }

        return true;
    }, [form, isDocente, isAdministrativo]);

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        // Reset program when faculty changes
        if (name === "faculty") {
            setForm(prev => ({ ...prev, faculty: value, program: "" }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const toggleUserType = (id) => {
        setForm(prev => {
            const next = prev.userTypes.includes(id)
                ? prev.userTypes.filter(t => t !== id)
                : [...prev.userTypes, id];

            // Clean fields that no longer apply
            const nextIsDocente = next.includes("docente");
            const nextIsAdmin = next.includes("administrativo");
            return {
                ...prev,
                userTypes: next,
                contractType: nextIsDocente ? prev.contractType : "",
                faculty: nextIsDocente ? prev.faculty : "",
                program: nextIsDocente ? prev.program : "",
                cargo: nextIsAdmin ? prev.cargo : "",
                dependencia: nextIsAdmin ? prev.dependencia : "",
            };
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        setLoading(true);
        // TODO: llamar al servicio de registro
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex font-sans">

            <InstitutionalPanel side="left" />

            {/* Panel derecho — formulario */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 py-6 lg:px-12 overflow-y-auto">

                {/* Header con logo UDC */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-[#EC7A21] text-2xl font-bold leading-tight">Crear cuenta</h1>
                        <p className="text-gray-400 text-sm mt-0.5">Completa tus datos para acceder al sistema</p>
                    </div>
                    <img
                        src="/logo-udc.png"
                        alt="Universidad de Cartagena"
                        className="h-20 object-contain hidden sm:block"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                </div>

                <form onSubmit={onSubmit} noValidate className="space-y-3">

                    {/* Tipo de usuario */}
                    <div>
                        <p className={labelClass}>
                            Tipo de usuario{' '}
                            <span className="font-light text-gray-400">(puede elegir ambos)</span>
                        </p>
                        <div className="flex gap-3">
                            {userTypeOptions.map((type) => {
                                const checked = userTypes.includes(type.id);
                                return (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => toggleUserType(type.id)}
                                        className={`flex-1 relative p-3 rounded-md border-2 text-left transition shadow-[5px_2px_10px_3px_#0000000d] ${
                                            checked ? "border-[#EFB357] bg-white" : "border-[#e0d3d3] bg-white"
                                        }`}
                                    >
                                        {/* Checkbox top-left */}
                                        <div className={`absolute top-2.5 left-2.5 w-3.5 h-3.5 rounded border flex items-center justify-center transition ${
                                            checked ? 'bg-[#EFB357] border-[#EFB357]' : 'border-gray-300 bg-white'
                                        }`}>
                                            {checked && <div className="w-1.5 h-1.5 rounded-sm bg-white" />}
                                        </div>

                                        {/* Radio top-right */}
                                        <div className={`absolute top-2.5 right-2.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center transition ${
                                            checked ? 'border-[#EFB357]' : 'border-gray-300'
                                        }`}>
                                            {checked && <div className="w-1.5 h-1.5 rounded-full bg-[#EFB357]" />}
                                        </div>

                                        {/* Icono */}
                                        <div className={`mt-3 mb-1 ${checked ? 'text-[#EFB357]' : 'text-gray-400'}`}>
                                            {type.icon}
                                        </div>

                                        <p className={`font-bold text-xs ${checked ? 'text-gray-800' : 'text-gray-500'}`}>
                                            {type.title}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                                            {type.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Nombres y Apellidos */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Nombres</label>
                            <input type="text" name="firstName" value={firstName} onChange={onInputChange} autoComplete="given-name" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Apellidos</label>
                            <input type="text" name="lastName" value={lastName} onChange={onInputChange} autoComplete="family-name" className={inputClass} />
                        </div>
                    </div>

                    {/* Cédula y Teléfono */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>Cédula</label>
                            <input type="text" name="documentId" value={documentId} onChange={onInputChange} inputMode="numeric" autoComplete="off" className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Teléfono</label>
                            <input type="tel" name="phone" value={phone} onChange={onInputChange} autoComplete="tel" className={inputClass} />
                        </div>
                    </div>

                    {/* ── Campos DOCENTE ── */}
                    {showDocenteFields && (
                        <>
                            {/* Tipo de contrato */}
                            <div>
                                <label className={labelClass}>
                                    Tipo de contrato
                                    <span className="text-[#EC7A21] ml-0.5">*</span>
                                </label>
                                <SelectWithArrow
                                    name="contractType"
                                    value={contractType}
                                    onChange={onInputChange}
                                    options={contractOptions}
                                    placeholder="Selecciona un tipo de contrato"
                                />
                            </div>

                            {/* Facultad y Programa */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>
                                        Facultad
                                        <span className="text-[#EC7A21] ml-0.5">*</span>
                                    </label>
                                    <SelectWithArrow
                                        name="faculty"
                                        value={faculty}
                                        onChange={onInputChange}
                                        options={facultyOptions}
                                        placeholder="Selecciona una facultad"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>
                                        Programa
                                        <span className="text-[#EC7A21] ml-0.5">*</span>
                                        {!faculty && (
                                            <span className="font-light text-gray-400 ml-1">(elige facultad primero)</span>
                                        )}
                                    </label>
                                    <SelectWithArrow
                                        name="program"
                                        value={program}
                                        onChange={onInputChange}
                                        options={availablePrograms}
                                        placeholder={faculty ? "Selecciona un programa" : "— primero elige facultad —"}
                                        disabled={!faculty}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Campos ADMINISTRATIVO ── */}
                    {showAdminFields && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelClass}>
                                    Cargo
                                    <span className="text-[#EC7A21] ml-0.5">*</span>
                                </label>
                                <SelectWithArrow
                                    name="cargo"
                                    value={cargo}
                                    onChange={onInputChange}
                                    options={cargoOptions}
                                    placeholder="Selecciona un cargo"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>
                                    Dependencia
                                    <span className="text-[#EC7A21] ml-0.5">*</span>
                                </label>
                                <SelectWithArrow
                                    name="dependencia"
                                    value={dependencia}
                                    onChange={onInputChange}
                                    options={dependenciaOptions}
                                    placeholder="Selecciona una dependencia"
                                />
                            </div>
                        </div>
                    )}

                    {/* Correo electrónico */}
                    <div>
                        <label className={labelClass}>Correo electrónico</label>
                        <input type="email" name="email" value={email} onChange={onInputChange} placeholder="usuario@unicartagena.edu.co" autoComplete="email" className={inputClass} />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className={labelClass}>Contraseña</label>
                        <PasswordInput name="password" value={password} onChange={onInputChange} autoComplete="new-password" />
                    </div>

                    {/* Confirmar contraseña */}
                    <div>
                        <label className={labelClass}>Confirmar contraseña</label>
                        <PasswordInput name="confirmPassword" value={confirmPassword} onChange={onInputChange} autoComplete="new-password" />
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
                        )}
                    </div>

                    {/* Botón */}
                    <LoadingButton
                        loading={loading}
                        disabled={!isValid}
                        className="w-full bg-[#EC7A21] hover:bg-[#CF620C] text-white text-sm font-bold py-2.5 rounded-md shadow-[5px_2px_10px_3px_#0000000d] border-2 border-[#C8963E]"
                    >
                        Crear cuenta
                    </LoadingButton>

                </form>

                <p className="text-center text-xs text-gray-400 mt-3">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-[#A43D29] font-bold hover:underline">
                        Inicia sesión
                    </Link>
                </p>

            </div>
        </div>
    );
};