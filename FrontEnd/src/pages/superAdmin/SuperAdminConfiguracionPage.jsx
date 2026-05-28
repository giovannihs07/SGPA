import { useState } from "react";
import { AlertCircle, RefreshCw, Building2, School, GraduationCap } from "lucide-react";
import { useConfiguracionInstitucional } from "../../hooks/superadmin/useConfiguracionInstitucional";
import { NIVEL_LABELS } from "./superAdminHelpers";
import { InstitucionPanel, FacultadesPanel, ProgramasPanel } from "./components/ConfigInstitucionalPanels";

const TABS = [
    { id: "institucion", label: "Institución",  icon: Building2 },
    { id: "facultades",  label: "Facultades",   icon: School },
    { id: "programas",   label: "Programas",    icon: GraduationCap },
];

export const SuperAdminConfiguracionPage = () => {
    const [tab, setTab] = useState("institucion");
    const hook = useConfiguracionInstitucional();

    if (hook.loading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
                <RefreshCw size={16} className="animate-spin" /> Cargando configuración…
            </div>
        );
    }

    if (hook.error) {
        return (
            <div className="flex flex-col items-center py-20 gap-3 text-red-500">
                <AlertCircle size={24} />
                <p className="text-sm">{hook.error}</p>
                <button onClick={hook.refetch} className="text-xs text-[#EC7A21] hover:underline">Reintentar</button>
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setTab(id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
                            rounded-t-lg transition border-b-2 -mb-px
                            ${tab === id
                                ? "border-[#EC7A21] text-[#EC7A21] bg-[#ffc20e]/5"
                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                    >
                        <Icon size={14} /> {label}
                    </button>
                ))}
            </div>

            {tab === "institucion" && (
                <InstitucionPanel
                    instituciones={hook.instituciones}
                    formInst={hook.formInst}
                    setFormInst={hook.setFormInst}
                    editInstId={hook.editInstId}
                    saving={hook.saving}
                    onSubmit={hook.guardarInstitucion}
                    onEdit={hook.iniciarEditarInst}
                    onCancel={hook.cancelarInst}
                    onDelete={hook.eliminarInst}
                />
            )}

            {tab === "facultades" && (
                <FacultadesPanel
                    instituciones={hook.instituciones}
                    institucionSel={hook.institucionSel}
                    setInstitucionSel={hook.setInstitucionSel}
                    facultades={hook.facultades}
                    formFac={hook.formFac}
                    setFormFac={hook.setFormFac}
                    editFacId={hook.editFacId}
                    saving={hook.saving}
                    onSubmit={hook.guardarFacultad}
                    onEdit={hook.iniciarEditarFac}
                    onCancel={hook.cancelarFac}
                    onDelete={hook.eliminarFac}
                />
            )}

            {tab === "programas" && (
                <ProgramasPanel
                    facultades={hook.facultades}
                    facultadSel={hook.facultadSel}
                    setFacultadSel={hook.setFacultadSel}
                    niveles={hook.niveles}
                    programas={hook.programas}
                    formProg={hook.formProg}
                    setFormProg={hook.setFormProg}
                    editProgId={hook.editProgId}
                    saving={hook.saving}
                    onSubmit={hook.guardarPrograma}
                    onEdit={hook.iniciarEditarProg}
                    onCancel={hook.cancelarProg}
                    onDelete={hook.eliminarProg}
                    NIVEL_LABELS={NIVEL_LABELS}
                />
            )}
        </div>
    );
};
