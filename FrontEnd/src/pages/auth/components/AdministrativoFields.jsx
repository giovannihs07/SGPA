import { cargoOptions, dependenciaOptions } from "../registerConfig";
import { SelectWithArrow } from "../../../components/ui/SelectWithArrow";

const labelClass = "block text-xs font-bold text-gray-700 mb-1.5";

export const AdministrativoFields = ({ cargo, dependencia, onInputChange }) => (
    <div className="grid grid-cols-2 gap-3">
        <div>
            <label className={labelClass}>
                Cargo <span className="text-[#EC7A21]">*</span>
            </label>
            <SelectWithArrow
                name="cargo"
                value={cargo}
                onChange={onInputChange}
                options={cargoOptions}
                placeholder="Selecciona un cargo"
            />
        </div>
        <div>
            <label className={labelClass}>
                Dependencia <span className="text-[#EC7A21]">*</span>
            </label>
            <SelectWithArrow
                name="dependencia"
                value={dependencia}
                onChange={onInputChange}
                options={dependenciaOptions}
                placeholder="Selecciona una dependencia"
            />
        </div>
    </div>
);
