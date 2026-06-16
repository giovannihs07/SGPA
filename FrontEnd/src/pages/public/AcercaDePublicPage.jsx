import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Globe, Lock, Users } from "lucide-react";
import { SgpaBrandMark } from "../../components/ui/SgpaBrandMark";
import { card, text } from "../../components/ui/themeTokens";
import { PUBLIC_FOOTER } from "../../components/layout/footerConfig";

const Seccion = ({ icon: Icon, titulo, children }) => (
    <section className={`${card} p-5 sm:p-6 space-y-3`}>
        <div className="flex items-center gap-2">
            <Icon size={18} className="text-[#EC7A21] shrink-0" aria-hidden="true" />
            <h2 className={`text-base font-bold ${text.primary}`}>{titulo}</h2>
        </div>
        <div className={`text-sm leading-relaxed space-y-2 ${text.secondary}`}>
            {children}
        </div>
    </section>
);

export const AcercaDePublicPage = () => (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
        <Link
            to="/portal/public"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#EC7A21] hover:underline"
        >
            <ArrowLeft size={16} aria-hidden="true" />
            Volver al portal
        </Link>

        <header className="space-y-4">
            <SgpaBrandMark size="large" />
            <h1 className={`text-2xl sm:text-3xl font-bold ${text.primary}`}>
                Acerca del portal público
            </h1>
            <p className={`text-sm leading-relaxed ${text.muted}`}>
                Información sobre el Sistema de Gestión de Producción Académica (SGPA) y el catálogo
                abierto de la {PUBLIC_FOOTER.udcNombre}.
            </p>
        </header>

        <Seccion icon={BookOpen} titulo="¿Qué es SGPA?">
            <p>
                SGPA es el sistema institucional para que los docentes de la {PUBLIC_FOOTER.udcNombre}{" "}
                registren, organicen y reporten su producción académica: artículos, libros, proyectos,
                productos formativos y demás evidencias vinculadas a su labor investigativa y académica.
            </p>
        </Seccion>

        <Seccion icon={Globe} titulo="¿Qué muestra este portal?">
            <p>
                Esta sección pública presenta únicamente los productos que los docentes han{" "}
                <strong className="font-semibold">publicado voluntariamente</strong> en SGPA para consulta
                de la comunidad universitaria y del público en general.
            </p>
            <p>
                Puedes explorar el catálogo, filtrar por categoría o tipo, buscar por nombre o docente,
                y consultar el detalle de cada producto junto con los archivos marcados como de acceso público.
            </p>
        </Seccion>

        <Seccion icon={Lock} titulo="¿Qué no incluye?">
            <ul className="list-disc pl-5 space-y-1.5">
                <li>Productos registrados pero aún sin publicar en el portal.</li>
                <li>Archivos o metadatos que el docente no ha habilitado para acceso público.</li>
                <li>Información administrativa interna del sistema (usuarios, auditoría, reportes institucionales).</li>
                <li>Toda la producción académica histórica de la universidad fuera de SGPA.</li>
            </ul>
        </Seccion>

        <Seccion icon={Users} titulo="¿Cómo publican los docentes?">
            <p>
                Los docentes autenticados en SGPA crean sus productos, adjuntan evidencias y deciden cuándo
                publicarlos en el portal. La visibilidad de cada archivo puede configurarse de forma individual.
            </p>
            <p>
                Si eres docente de la institución y necesitas acceso, utiliza tu correo{" "}
                <span className="font-medium">@unicartagena.edu.co</span> para{" "}
                <Link to="/login" className="text-[#EC7A21] font-semibold hover:underline">
                    iniciar sesión
                </Link>
                .
            </p>
        </Seccion>

        <p className={`text-xs text-center pb-4 ${text.muted}`}>
            {PUBLIC_FOOTER.disclaimer}
        </p>
    </div>
);
