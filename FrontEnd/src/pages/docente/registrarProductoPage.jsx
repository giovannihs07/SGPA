import { useRegistrarProducto } from "../../hooks/useRegistrarProducto";
import { ProductoForm } from "./components/ProductoForm";

export const RegistrarProductoPage = () => {
    const hook = useRegistrarProducto();

    return (
        <div className="max-w-3xl mx-auto">
            <ProductoForm
                {...hook}
                submitLabel="Registrar producto"
                loadingLabel="Registrando…"
            />
        </div>
    );
};
