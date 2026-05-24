import { Link } from "react-router-dom";
import { LoadingButton }          from "../../components/ui/LoadingButton";
import { PasswordInput }          from "../../components/ui/PasswordInput";
import { InstitutionalPanel }     from "../../components/ui/InstitutionalPanel";
import { useRegisterForm }        from "./hooks/useRegisterForm";
import { useFacultadesProgramas } from "../../hooks/useFacultadesProgramas";
import { UserTypeSelector }       from "./components/UserTypeSelector";
import { DocenteFields }          from "./components/DocenteFields";
import { AdministrativoFields }   from "./components/AdministrativoFields";

const inputClass =
    "w-full px-3 py-2 rounded-md border-2 border-[#cab4b4] bg-white text-sm text-gray-800 " +
    "placeholder-gray-300 focus:outline-none focus:border-[#EFB357] transition shadow-[5px_2px_10px_3px_#0000000d]";
const labelClass = "block text-xs font-bold text-gray-700 mb-1.5";

export const RegisterPage = () => {
    const {
        form, loading, isValid,
        isDocente, isAdministrativo,
        onInputChange, toggleUserType,
        onProgramaChange, addPrograma, removePrograma,
        onTituloChange,   addTitulo,   removeTitulo,
        onSubmit,
    } = useRegisterForm();

    const {
        facultades, getProgramas, cargarProgramas,
        loadingFacultades, errorFacultades,
    } = useFacultadesProgramas();

    const {
        userTypes, firstName, lastName, documentId, phone,
        codigoDocente, tipoContrato, programas, titulos,
        cargo, dependencia, email, password, confirmPassword,
    } = form;

    return (
        <div className="min-h-screen flex font-sans">
            <InstitutionalPanel side="left" />

            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 py-6 lg:px-12 overflow-y-auto">

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-[#EC7A21] text-2xl font-bold leading-tight">Crear cuenta</h1>
                        <p className="text-gray-400 text-sm mt-0.5">Completa tus datos para acceder al sistema</p>
                    </div>
                    <img
                        src="/logo-udc.png"
                        alt="Universidad de Cartagena"
                        className="h-20 object-contain hidden sm:block"
                        onError={(e) => e.target.style.display = "none"}
                    />
                </div>

                <form onSubmit={onSubmit} noValidate className="space-y-3">

                    <UserTypeSelector userTypes={userTypes} onToggle={toggleUserType} />

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

                    {/* Campos por rol */}
                    {isDocente && (
                        <DocenteFields
                            codigoDocente={codigoDocente}
                            tipoContrato={tipoContrato}
                            onInputChange={onInputChange}
                            programas={programas}
                            onProgramaChange={onProgramaChange}
                            addPrograma={addPrograma}
                            removePrograma={removePrograma}
                            titulos={titulos}
                            onTituloChange={onTituloChange}
                            addTitulo={addTitulo}
                            removeTitulo={removeTitulo}
                            facultades={facultades}
                            getProgramas={getProgramas}
                            cargarProgramas={cargarProgramas}
                            loadingFacultades={loadingFacultades}
                            errorFacultades={errorFacultades}
                        />
                    )}

                    {isAdministrativo && (
                        <AdministrativoFields
                            cargo={cargo}
                            dependencia={dependencia}
                            onInputChange={onInputChange}
                        />
                    )}

                    {/* Correo */}
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

                    <LoadingButton
                        loading={loading}
                        disabled={!isValid}
                        className="w-full bg-[#EC7A21] hover:bg-[#CF620C] text-white text-sm font-bold py-2.5 rounded-md shadow-[5px_2px_10px_3px_#0000000d] border-2 border-[#C8963E]"
                    >
                        Crear cuenta
                    </LoadingButton>

                </form>

                <p className="text-center text-xs text-gray-400 mt-3">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-[#A43D29] font-bold hover:underline">
                        Inicia sesión
                    </Link>
                </p>

            </div>
        </div>
    );
};
