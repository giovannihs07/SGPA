/** Mensaje de error inline debajo de un campo de formulario. */
export const FieldError = ({ id, message }) => {
    if (!message) return null;

    return (
        <p id={id} role="alert" className="mt-1 text-xs text-red-600">
            {message}
        </p>
    );
};
