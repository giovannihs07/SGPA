import { nombreDocente } from "../pages/public/components/publicProductoUi";

const buildParamsDocente = (producto) => {
    const nombre = nombreDocente(producto);
    if (!nombre || nombre === "—") return null;

    const params = new URLSearchParams();
    if (producto?.docenteCodigo) {
        params.set("docenteCodigo", producto.docenteCodigo);
        params.set("docenteNombre", nombre);
    } else {
        params.set("docente", nombre);
    }
    return params;
};

/** URL del catálogo filtrado por docente (reutiliza búsqueda del API vía `q`). */
export const urlVistaDocente = (producto) => {
    const params = buildParamsDocente(producto);
    if (!params) return null;
    return `/portal/public?${params.toString()}#catalogo`;
};

export const urlVistaDocentePorNombre = (nombre, codigo = null) => {
    if (!nombre?.trim()) return null;
    const params = new URLSearchParams();
    if (codigo) {
        params.set("docenteCodigo", codigo);
        params.set("docenteNombre", nombre.trim());
    } else {
        params.set("docente", nombre.trim());
    }
    return `/portal/public?${params.toString()}#catalogo`;
};
