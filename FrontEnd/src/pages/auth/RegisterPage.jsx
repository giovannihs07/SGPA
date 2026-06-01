import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { LoadingButton } from "../../components/ui/LoadingButton";
import { PasswordInput } from "../../components/ui/PasswordInput";
import { InstitutionalPanel } from "../../components/ui/InstitutionalPanel";
import { FormBanner } from "../../components/ui/FormBanner";
import { FieldError } from "../../components/ui/FieldError";
import { inputAuth, inputError, labelBold, btnGhost } from "../../components/ui/themeTokens";
import { useRegisterForm } from "./hooks/useRegisterForm";
import { useFacultadesProgramas } from "../../hooks/useFacultadesProgramas";
import { UserTypeSelector } from "./components/UserTypeSelector";
import { DocenteFields } from "./components/DocenteFields";
import { AdministrativoFields } from "./components/AdministrativoFields";
import { FormSection } from "./components/FormSection";
import { RegisterWizardProgress } from "./components/RegisterWizardProgress";

const req = <span className="text-[#EC7A21]">*</span>;

const fieldClass = (fieldErrors, name) =>
    `${inputAuth} ${fieldErrors[name] ? inputError : ""}`;

export const RegisterPage = () => {
    const panelRef = useRef(null);

    const {
        form, loading, step, fieldErrors, formError, setFormError,
        isDocente, isAdministrativo,
        onInputChange, toggleUserType,
        onProgramaChange, addPrograma, removePrograma,
        onTituloChange, addTitulo, removeTitulo,
        goNext, goBack, onSubmit,
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

    useEffect(() => {
        panelRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    const roleSectionTitle = isDocente && isAdministrativo
        ? "Información docente y administrativa"
        : isDocente
            ? "Información docente"
            : "Información administrativa";

    return (
        <div className="min-h-screen flex font-sans">
            <InstitutionalPanel side="left" />

            <div
                ref={panelRef}
                className="w-full lg:w-1/2 bg-white flex flex-col justify-start px-8 py-8 lg:px-12 lg:py-10 overflow-y-auto"
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-[#EC7A21] text-2xl font-bold leading-tight">Crear cuenta</h1>
                        <p className="text-gray-400 text-sm mt-0.5">
                            Completa tus datos para acceder al sistema
                        </p>
                    </div>
                    <img
                        src="/logo-udc.png"
                        alt="Universidad de Cartagena"
                        className="h-20 object-contain hidden sm:block"
                        onError={(e) => { e.target.style.display = "none"; }}
                    />
                </div>

                <RegisterWizardProgress currentStep={step} />

                <p className="text-xs text-gray-400 mb-4">
                    Los campos marcados con {req} son obligatorios
                </p>

                <form onSubmit={onSubmit} noValidate className="space-y-6">

                    {step === 1 && (
                        <>
                            <FormSection
                                title="Tipo de usuario"
                                description="Selecciona tu rol dentro del sistema"
                            >
                                <UserTypeSelector
                                    userTypes={userTypes}
                                    onToggle={toggleUserType}
                                    error={fieldErrors.userTypes}
                                />
                            </FormSection>

                            <FormSection
                                title="Datos personales"
                                description="Información básica de identificación"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="firstName" className={labelBold}>Nombres {req}</label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            name="firstName"
                                            value={firstName}
                                            onChange={onInputChange}
                                            autoComplete="given-name"
                                            aria-invalid={!!fieldErrors.firstName || undefined}
                                            className={fieldClass(fieldErrors, "firstName")}
                                        />
                                        <FieldError message={fieldErrors.firstName} />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className={labelBold}>Apellidos {req}</label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            name="lastName"
                                            value={lastName}
                                            onChange={onInputChange}
                                            autoComplete="family-name"
                                            aria-invalid={!!fieldErrors.lastName || undefined}
                                            className={fieldClass(fieldErrors, "lastName")}
                                        />
                                        <FieldError message={fieldErrors.lastName} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor="documentId" className={labelBold}>Cédula {req}</label>
                                        <input
                                            id="documentId"
                                            type="text"
                                            name="documentId"
                                            value={documentId}
                                            onChange={onInputChange}
                                            inputMode="numeric"
                                            autoComplete="off"
                                            aria-invalid={!!fieldErrors.documentId || undefined}
                                            className={fieldClass(fieldErrors, "documentId")}
                                        />
                                        <FieldError message={fieldErrors.documentId} />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className={labelBold}>Teléfono {req}</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            name="phone"
                                            value={phone}
                                            onChange={onInputChange}
                                            autoComplete="tel"
                                            aria-invalid={!!fieldErrors.phone || undefined}
                                            className={fieldClass(fieldErrors, "phone")}
                                        />
                                        <FieldError message={fieldErrors.phone} />
                                    </div>
                                </div>
                            </FormSection>
                        </>
                    )}

                    {step === 2 && (
                        <FormSection
                            title={roleSectionTitle}
                            description="Datos específicos según tu rol"
                        >
                            <div className="space-y-3">
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
                                        fieldErrors={fieldErrors}
                                    />
                                )}

                                {isAdministrativo && (
                                    <AdministrativoFields
                                        cargo={cargo}
                                        dependencia={dependencia}
                                        onInputChange={onInputChange}
                                        fieldErrors={fieldErrors}
                                    />
                                )}
                            </div>
                        </FormSection>
                    )}

                    {step === 3 && (
                        <FormSection
                            title="Acceso al sistema"
                            description="Correo institucional y contraseña"
                        >
                            <div>
                                <label htmlFor="email" className={labelBold}>Correo electrónico {req}</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={onInputChange}
                                    placeholder="usuario@unicartagena.edu.co"
                                    autoComplete="email"
                                    aria-invalid={!!fieldErrors.email || undefined}
                                    className={fieldClass(fieldErrors, "email")}
                                />
                                <FieldError message={fieldErrors.email} />
                            </div>

                            <div>
                                <label htmlFor="password" className={labelBold}>Contraseña {req}</label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={onInputChange}
                                    autoComplete="new-password"
                                    hasError={!!fieldErrors.password}
                                />
                                <FieldError message={fieldErrors.password} />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className={labelBold}>Confirmar contraseña {req}</label>
                                <PasswordInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={onInputChange}
                                    autoComplete="new-password"
                                    hasError={!!fieldErrors.confirmPassword}
                                />
                                <FieldError message={fieldErrors.confirmPassword} />
                            </div>
                        </FormSection>
                    )}

                    {formError && (
                        <FormBanner variant="error" onClose={() => setFormError("")}>
                            {formError}
                        </FormBanner>
                    )}

                    <div className="flex gap-3">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={goBack}
                                disabled={loading}
                                className={`flex-1 py-2.5 ${btnGhost} border border-gray-200 disabled:opacity-50`}
                            >
                                Atrás
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={goNext}
                                className="flex-1 bg-[#EC7A21] hover:bg-[#CF620C] text-white text-base font-bold py-2.5 rounded-md shadow-[5px_2px_10px_3px_#0000000d] border-2 border-[#C8963E] transition"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <LoadingButton
                                loading={loading}
                                disabled={loading}
                                className="flex-1 bg-[#EC7A21] hover:bg-[#CF620C] text-white text-base font-bold py-2.5 rounded-md shadow-[5px_2px_10px_3px_#0000000d] border-2 border-[#C8963E]"
                            >
                                Crear cuenta
                            </LoadingButton>
                        )}
                    </div>

                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-[#A43D29] font-bold hover:underline">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};
