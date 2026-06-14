import { ExternalLink } from "lucide-react";
import { FOOTER, PUBLIC_FOOTER } from "./footerConfig";

const currentYear = new Date().getFullYear();

const EnlaceExterno = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-white/70 hover:text-[#ffc20e] transition"
    >
        {children}
        <ExternalLink size={11} aria-hidden="true" />
    </a>
);

const EnlaceInterno = ({ href, children }) => (
    <a href={href} className="text-white/70 hover:text-[#ffc20e] transition">
        {children}
    </a>
);

export const PublicFooter = () => (
    <footer
        role="contentinfo"
        className="shrink-0 bg-[#171717] border-t border-[#ffc20e]/30"
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <div>
                    <p className="text-sm font-bold text-[#ffc20e]">{FOOTER.appName}</p>
                    <p className="text-xs mt-1 leading-relaxed text-white/70">
                        Sistema de Gestión de Producción Académica de la {PUBLIC_FOOTER.udcNombre}.
                    </p>
                    <p className="text-xs mt-2 leading-relaxed text-white/60">
                        {PUBLIC_FOOTER.disclaimer}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#ffc20e] mb-2">
                        Enlaces institucionales
                    </p>
                    <ul className="space-y-1.5 text-xs">
                        <li>
                            <EnlaceExterno href={PUBLIC_FOOTER.udcUrl}>
                                Sitio web {PUBLIC_FOOTER.udcNombre}
                            </EnlaceExterno>
                        </li>
                        <li>
                            <EnlaceExterno href={PUBLIC_FOOTER.transparenciaUrl}>
                                Transparencia y acceso a la información
                            </EnlaceExterno>
                        </li>
                        <li>
                            <EnlaceExterno href={PUBLIC_FOOTER.privacidadUrl}>
                                Política de privacidad y datos personales
                            </EnlaceExterno>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#ffc20e] mb-2">
                        Acceso
                    </p>
                    <ul className="space-y-1.5 text-xs">
                        <li>
                            <EnlaceInterno href="/portal/public">
                                Portal público de producción
                            </EnlaceInterno>
                        </li>
                        <li>
                            <EnlaceInterno href="/login">
                                Iniciar sesión (docentes y administrativos)
                            </EnlaceInterno>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#ffc20e]/30
                flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between text-xs text-white/60">
                <p>
                    <span className="font-semibold text-[#ffc20e]">{FOOTER.appName}</span>
                    {" · "}
                    {FOOTER.institution}
                    {" · "}
                    © {currentYear}
                </p>
                <p className="shrink-0">v{FOOTER.version}</p>
            </div>
        </div>
    </footer>
);
