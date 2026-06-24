/** Deja solo dígitos (0-9). Útil para cédula, teléfono, códigos, etc. */
export const onlyDigits = (value) => String(value ?? "").replace(/\D/g, "");
