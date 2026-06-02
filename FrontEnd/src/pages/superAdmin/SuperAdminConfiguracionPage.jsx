import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, RefreshCw, Building2, School, GraduationCap, BookOpen } from "lucide-react";
import { useConfiguracionInstitucional } from "../../hooks/superadmin/useConfiguracionInstitucional";
import { useConfiguracionProductos } from "../../hooks/superadmin/useConfiguracionProductos";
import { NIVEL_LABELS } from "./superAdminHelpers";
import { InstitucionPanel, FacultadesPanel, ProgramasPanel } from "./components/ConfigInstitucionalPanels";
import {
    TaxonomiaSetupPanel,
    TaxonomiaResumenPanel,
    TaxonomiaManualGuia,
    TaxonomiaPendienteBanner,
    CategoriasProductoPanel,
    SubcategoriasProductoPanel,
    TiposProductoPanel,
} from "./components/ConfigProductosPanels";

const TABS = [
    { id: "institucion", label: "Institución",  icon: Building2 },
    { id: "facultades",  label: "Facultades",   icon: School },
    { id: "programas",   label: "Programas",    icon: GraduationCap },
    { id: "productos",   label: "Productos",    icon: BookOpen },
];

const PRODUCTO_SUBTABS = [
    { id: "categorias",    label: "Categorías" },
    { id: "subcategorias", label: "Subcategorías" },
    { id: "tipos",         label: "Tipos" },
];

export const SuperAdminConfiguracionPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tab, setTab] = useState(() => searchParams.get("tab") || "institucion");
    const hook = useConfiguracionInstitucional();
    const productos = useConfiguracionProductos();

    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam && TABS.some((t) => t.id === tabParam)) {
            setTab(tabParam);
        }
    }, [searchParams]);

    const irATab = (id) => {
        setTab(id);
        setSearchParams(id === "institucion" ? {} : { tab: id }, { replace: true });
    };

    const loading = tab === "productos" ? productos.loading : hook.loading;
    const error = tab === "productos" ? productos.error : hook.error;
    const refetch = tab === "productos" ? productos.refetch : hook.refetch;

    const mostrarBannerPendiente =
        !productos.loading
        && !productos.taxonomiaConfigurada
        && tab !== "productos";

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 text-gray-400 text-sm gap-2">
                <RefreshCw size={16} className="animate-spin" /> Cargando configuración…
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center py-20 gap-3 text-red-500">
                <AlertCircle size={24} />
                <p className="text-sm">{error}</p>
                <button onClick={refetch} className="text-xs text-[#EC7A21] hover:underline">Reintentar</button>
            </div>
        );
    }

    return (
        <div className="space-y-5 max-w-4xl mx-auto">
            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    Configuración del sistema
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Estructura institucional y taxonomía de productos académicos para docentes.
                </p>
            </div>

            {mostrarBannerPendiente && (
                <TaxonomiaPendienteBanner onIrAProductos={() => irATab("productos")} />
            )}

            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => irATab(id)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold
                            rounded-t-lg transition border-b-2 -mb-px
                            ${tab === id
                                ? "border-[#EC7A21] text-[#EC7A21] bg-[#ffc20e]/5"
                                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                    >
                        <Icon size={14} /> {label}
                        {id === "productos" && !productos.taxonomiaConfigurada && (
                            <span className="w-2 h-2 rounded-full bg-amber-500" title="Pendiente" />
                        )}
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

            {tab === "productos" && (
                <div className="space-y-5">
                    {productos.mostrarSetup && (
                        <TaxonomiaSetupPanel
                            onCargarPredeterminada={productos.cargarPredeterminada}
                            onModoManual={productos.elegirModoManual}
                            seeding={productos.seeding}
                        />
                    )}

                    {productos.mostrarGestion && (
                        <>
                            {productos.taxonomiaConfigurada && (
                                <TaxonomiaResumenPanel estado={productos.estado} />
                            )}

                            {productos.esFlujoManual && productos.pasoManual != null && (
                                <TaxonomiaManualGuia
                                    pasoActual={productos.pasoManual}
                                    subTab={productos.subTab}
                                    onIrAPaso={productos.setSubTab}
                                />
                            )}

                            <div className="flex flex-wrap gap-2">
                                {PRODUCTO_SUBTABS.map(({ id, label }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => productos.setSubTab(id)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition
                                            ${productos.subTab === id
                                                ? "bg-[#EC7A21] text-white"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {productos.subTab === "categorias" && (
                                <CategoriasProductoPanel
                                    categorias={productos.categorias}
                                    formCat={productos.formCat}
                                    setFormCat={productos.setFormCat}
                                    editCatId={productos.editCatId}
                                    saving={productos.saving}
                                    onSubmit={productos.guardarCategoria}
                                    onEdit={productos.iniciarEditarCat}
                                    onCancel={productos.cancelarCat}
                                    onToggle={productos.toggleCategoria}
                                    onDelete={productos.eliminarCategoria}
                                />
                            )}

                            {productos.subTab === "subcategorias" && (
                                <SubcategoriasProductoPanel
                                    categorias={productos.categorias}
                                    categoriaSel={productos.categoriaSel}
                                    setCategoriaSel={productos.setCategoriaSel}
                                    subcategorias={productos.subcategorias}
                                    formSub={productos.formSub}
                                    setFormSub={productos.setFormSub}
                                    editSubId={productos.editSubId}
                                    saving={productos.saving}
                                    onSubmit={productos.guardarSubcategoria}
                                    onEdit={productos.iniciarEditarSub}
                                    onCancel={productos.cancelarSub}
                                    onToggle={productos.toggleSubcategoria}
                                    onDelete={productos.eliminarSubcategoria}
                                />
                            )}

                            {productos.subTab === "tipos" && (
                                <TiposProductoPanel
                                    categorias={productos.categorias}
                                    categoriaSel={productos.categoriaSel}
                                    setCategoriaSel={productos.setCategoriaSel}
                                    subcategorias={productos.subcategorias}
                                    subcategoriaSel={productos.subcategoriaSel}
                                    setSubcategoriaSel={productos.setSubcategoriaSel}
                                    tipos={productos.tipos}
                                    formTipo={productos.formTipo}
                                    setFormTipo={productos.setFormTipo}
                                    editTipoId={productos.editTipoId}
                                    saving={productos.saving}
                                    onSubmit={productos.guardarTipo}
                                    onEdit={productos.iniciarEditarTipo}
                                    onCancel={productos.cancelarTipo}
                                    onToggle={productos.toggleTipo}
                                    onDelete={productos.eliminarTipo}
                                    onAgregarAtributo={productos.agregarAtributo}
                                    onQuitarAtributo={productos.quitarAtributo}
                                    onActualizarAtributo={productos.actualizarAtributo}
                                />
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
