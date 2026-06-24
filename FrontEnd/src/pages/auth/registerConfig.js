// Estado inicial

export const initialForm = {
    userTypes:       [],
    firstName:       "",
    lastName:        "",
    documentId:      "",
    phone:           "",
    codigoDocente:   "",
    tipoContrato:   "",
    programas:       [{ facultadId: "", programaId: "", facultadNombre: "", programaNombre: "" }],
    cargo:           "",
    dependencia:     "",
    email:           "",
    password:        "",
    confirmPassword: "",
};

// Opciones estáticas para selects y checkboxes

export const userTypeOptions = [
    {
        id:          "docente",
        title:       "Docente",
        description: "Registro y gestión de producción académica",
    },
    {
        id:          "administrativo",
        title:       "Administrativo",
        description: "Gestión y supervisión de la producción académica",
    },
];

export const cargoOptions = [
    "Administrativo", "Contratista", "Directivo", "Técnico", "Auxiliar administrativo",
];

export const dependenciaOptions = [
    "Rectoría", "Vicerrectoría Académica", "Vicerrectoría Administrativa",
    "Secretaría General", "Bienestar Universitario", "Dirección de Investigaciones",
    "Oficina de Sistemas", "Oficina de Planeación",
];

export const nivelOptions = [
    "PREGRADO", "MAESTRIA", "DOCTORADO", "ESPECIALIZACION", "POSTDOCTORADO",
];

export const tipoContratoOptions = [
    "Docente de planta", "Docente ocasional", "Catedrático",
];

export const REGISTER_WIZARD_STEPS = [
    { id: 1, label: "Perfil" },
    { id: 2, label: "Rol" },
    { id: 3, label: "Acceso" },
];

export const REGISTER_TOTAL_STEPS = REGISTER_WIZARD_STEPS.length;