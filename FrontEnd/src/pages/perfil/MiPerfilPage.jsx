import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { useMiPerfil } from "../../hooks/useMiPerfil";
import { useFacultadesProgramas } from "../../hooks/useFacultadesProgramas";
import { text } from "../../components/ui/themeTokens";
import { PerfilCuentaResumen } from "./components/PerfilCuentaResumen";
import { PerfilDatosPersonalesForm } from "./components/PerfilDatosPersonalesForm";
import { PerfilDocenteSection } from "./components/PerfilDocenteSection";
import { PerfilAdministrativoSection } from "./components/PerfilAdministrativoSection";
import { PerfilSeguridadForm } from "./components/PerfilSeguridadForm";
import { tienePerfilDocente, tienePerfilAdministrativo } from "./perfilHelpers";

export const MiPerfilPage = () => {
    const { toast } = useToast();
    const {
        perfil,
        datos,
        docente,
        administrativo,
        programas,
        nuevoTitulo,
        passwords,
        loading,
        savingDatos,
        savingDocente,
        savingProgramas,
        savingAdministrativo,
        savingTitulo,
        deletingTituloId,
        savingPassword,
        error,
        fieldErrorsDatos,
        fieldErrorsDocente,
        fieldErrorsProgramas,
        fieldErrorsAdministrativo,
        fieldErrorsTitulo,
        fieldErrorsPassword,
        onDatosChange,
        onDocenteChange,
        onAdministrativoChange,
        onProgramaChange,
        addPrograma,
        removePrograma,
        onTituloChange,
        onPasswordChange,
        guardarDatos,
        guardarPerfilDocente,
        guardarProgramas,
        guardarPerfilAdministrativo,
        agregarTitulo,
        eliminarTitulo,
        guardarPassword,
        refetch,
        clearError,
    } = useMiPerfil();

    const {
        facultades,
        getProgramas,
        cargarProgramas,
        loadingFacultades,
        errorFacultades,
    } = useFacultadesProgramas();

    useEffect(() => {
        if (!perfil?.programas) return;
        [...perfil.programas].forEach((p) => {
            if (p.facultadId) cargarProgramas(p.facultadId);
        });
    }, [perfil?.programas, cargarProgramas]);

    const handleGuardarDatos = async (e) => {
        clearError();
        const ok = await guardarDatos(e);
        if (ok) toast.success("Datos personales actualizados");
    };

    const handleGuardarPerfilDocente = async (e) => {
        clearError();
        const ok = await guardarPerfilDocente(e);
        if (ok) toast.success("Perfil docente actualizado");
    };

    const handleGuardarProgramas = async (e) => {
        clearError();
        const ok = await guardarProgramas(e);
        if (ok) toast.success("Programas actualizados");
    };

    const handleGuardarPerfilAdministrativo = async (e) => {
        clearError();
        const ok = await guardarPerfilAdministrativo(e);
        if (ok) toast.success("Perfil administrativo actualizado");
    };

    const handleAgregarTitulo = async (e) => {
        clearError();
        const ok = await agregarTitulo(e);
        if (ok) toast.success("Título académico añadido");
    };

    const handleEliminarTitulo = async (tituloId) => {
        clearError();
        const ok = await eliminarTitulo(tituloId);
        if (ok) toast.success("Título eliminado");
    };

    const handleGuardarPassword = async (e) => {
        clearError();
        const ok = await guardarPassword(e);
        if (ok) toast.success("Contraseña actualizada correctamente");
    };

    if (loading) {
        return (
            <div className={`flex items-center justify-center py-20 text-sm ${text.muted}`}>
                Cargando perfil...
            </div>
        );
    }

    if (error && !perfil) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-500">
                <AlertCircle size={24} />
                <p className="text-sm">{error}</p>
                <button
                    onClick={refetch}
                    className="text-xs text-[#EC7A21] hover:underline flex items-center gap-1"
                >
                    <RefreshCw size={12} /> Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-4xl mx-auto">
            <div>
                <h2 className={`text-lg font-bold ${text.primary}`}>Mi perfil</h2>
                <p className={`text-sm ${text.muted} mt-1`}>
                    Consulta y actualiza tu información personal y credenciales de acceso.
                </p>
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20
                        px-4 py-3 text-sm text-red-700 dark:text-red-300"
                >
                    {error}
                </div>
            )}

            <PerfilCuentaResumen perfil={perfil} />
            <PerfilDatosPersonalesForm
                datos={datos}
                fieldErrors={fieldErrorsDatos}
                saving={savingDatos}
                onChange={onDatosChange}
                onSubmit={handleGuardarDatos}
            />
            {tienePerfilAdministrativo(perfil) && (
                <PerfilAdministrativoSection
                    administrativo={administrativo}
                    fieldErrors={fieldErrorsAdministrativo}
                    saving={savingAdministrativo}
                    onChange={onAdministrativoChange}
                    onSubmit={handleGuardarPerfilAdministrativo}
                />
            )}
            {tienePerfilDocente(perfil) && (
                <PerfilDocenteSection
                    perfil={perfil}
                    docente={docente}
                    programas={programas}
                    nuevoTitulo={nuevoTitulo}
                    fieldErrorsDocente={fieldErrorsDocente}
                    fieldErrorsProgramas={fieldErrorsProgramas}
                    fieldErrorsTitulo={fieldErrorsTitulo}
                    savingDocente={savingDocente}
                    savingProgramas={savingProgramas}
                    savingTitulo={savingTitulo}
                    deletingTituloId={deletingTituloId}
                    facultades={facultades}
                    getProgramas={getProgramas}
                    cargarProgramas={cargarProgramas}
                    loadingFacultades={loadingFacultades}
                    errorFacultades={errorFacultades}
                    onDocenteChange={onDocenteChange}
                    onProgramaChange={onProgramaChange}
                    onAddPrograma={addPrograma}
                    onRemovePrograma={removePrograma}
                    onTituloChange={onTituloChange}
                    onGuardarDocente={handleGuardarPerfilDocente}
                    onGuardarProgramas={handleGuardarProgramas}
                    onAgregarTitulo={handleAgregarTitulo}
                    onEliminarTitulo={handleEliminarTitulo}
                />
            )}
            <PerfilSeguridadForm
                passwords={passwords}
                fieldErrors={fieldErrorsPassword}
                saving={savingPassword}
                onChange={onPasswordChange}
                onSubmit={handleGuardarPassword}
            />
        </div>
    );
};
