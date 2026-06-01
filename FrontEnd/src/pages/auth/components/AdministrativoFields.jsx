import { cargoOptions, dependenciaOptions } from "../registerConfig";
import { SelectWithArrow } from "../../../components/ui/SelectWithArrow";
import { FieldError } from "../../../components/ui/FieldError";
import { labelBold } from "../../../components/ui/themeTokens";

const req = <span className="text-[#EC7A21]">*</span>;

export const AdministrativoFields = ({ cargo, dependencia, onInputChange, fieldErrors = {} }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
            <label htmlFor="cargo" className={labelBold}>
                Cargo {req}
            </label>
            <SelectWithArrow
                name="cargo"
                value={cargo}
                onChange={onInputChange}
                options={cargoOptions}
                placeholder="Selecciona un cargo"
                hasError={!!fieldErrors.cargo}
            />
            <FieldError message={fieldErrors.cargo} />
        </div>
        <div>
            <label htmlFor="dependencia" className={labelBold}>
                Dependencia {req}
            </label>
            <SelectWithArrow
                name="dependencia"
                value={dependencia}
                onChange={onInputChange}
                options={dependenciaOptions}
                placeholder="Selecciona una dependencia"
                hasError={!!fieldErrors.dependencia}
            />
            <FieldError message={fieldErrors.dependencia} />
        </div>
    </div>
);
