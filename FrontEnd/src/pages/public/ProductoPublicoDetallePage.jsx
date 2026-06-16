import { Navigate, useParams, useLocation } from "react-router-dom";

/** Redirige enlaces antiguos /portal/public/productos/:id → /portal/public?producto=:id */
export const ProductoPublicoDetallePage = () => {
    const { id } = useParams();
    const location = useLocation();

    const params = new URLSearchParams(
        location.state?.fromSearch?.startsWith("?")
            ? location.state.fromSearch.slice(1)
            : (location.state?.fromSearch ?? ""),
    );
    if (id) params.set("producto", id);

    const query = params.toString();
    return <Navigate to={`/portal/public${query ? `?${query}` : ""}`} replace />;
};
