import { Check } from "lucide-react";
import { REGISTER_WIZARD_STEPS, REGISTER_TOTAL_STEPS } from "../registerConfig";

export const RegisterWizardProgress = ({ currentStep }) => (
    <nav aria-label="Progreso del registro" className="mb-6">
        <ol className="flex items-center">
            {REGISTER_WIZARD_STEPS.map((step, index) => {
                const done = currentStep > step.id;
                const active = currentStep === step.id;
                const isLast = index === REGISTER_WIZARD_STEPS.length - 1;

                return (
                    <li
                        key={step.id}
                        className={`flex items-center ${isLast ? "" : "flex-1"}`}
                        aria-current={active ? "step" : undefined}
                    >
                        <div className="flex items-center gap-2 shrink-0">
                            <span
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                    done
                                        ? "bg-[#EFB357] text-white"
                                        : active
                                            ? "bg-[#EC7A21] text-white"
                                            : "bg-gray-100 text-gray-400"
                                }`}
                            >
                                {done ? <Check size={14} strokeWidth={3} /> : step.id}
                            </span>
                            <span
                                className={`text-xs font-semibold hidden sm:inline ${
                                    active ? "text-gray-800" : done ? "text-gray-600" : "text-gray-400"
                                }`}
                            >
                                {step.label}
                            </span>
                        </div>
                        {!isLast && (
                            <div
                                className={`flex-1 h-0.5 mx-2 sm:mx-3 transition ${
                                    done ? "bg-[#EFB357]" : "bg-gray-200"
                                }`}
                                aria-hidden="true"
                            />
                        )}
                    </li>
                );
            })}
        </ol>
        <p className="text-xs text-gray-400 mt-2">
            Paso {currentStep} de {REGISTER_TOTAL_STEPS}
        </p>
    </nav>
);
