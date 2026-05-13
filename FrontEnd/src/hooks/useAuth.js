import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginReducer } from "../reducers/loginReducer";
import { loginRequest } from "../services/authService";

const init = () =>
    JSON.parse(sessionStorage.getItem('login')) || {
        isAuth: false,
        isAdmin: false,
        user: undefined,
    };

export const useAuth = () => {
    const [login, dispatch] = useReducer(loginReducer, undefined, init);
    const navigate = useNavigate();

    const handlerLogin = async ({ email, password }) => {
        try {
            const response = await loginRequest({ email, password });
            const token = response.data.token;
            const claims = JSON.parse(window.atob(token.split('.')[1]));
            const user = { email: claims.sub };
            const isAdmin = claims.isAdmin;

            dispatch({ type: 'login', payload: { user, isAdmin } });

            sessionStorage.setItem('login', JSON.stringify({
                isAuth: true,
                isAdmin,
                user,
            }));
            sessionStorage.setItem('token', `Bearer ${token}`);

            navigate(isAdmin ? '/dashboard/admin' : '/dashboard/docente');

        } catch (error) {
            if (error.response?.status === 401) {
                Swal.fire('Error de autenticación', 'Email o contraseña inválidos', 'error');
            } else if (error.response?.status === 403) {
                Swal.fire('Acceso denegado', 'No tienes permisos para acceder', 'error');
            } else {
                Swal.fire('Error', 'Ocurrió un error inesperado', 'error');
            }
        }
    };

    const handlerLogout = () => {
        dispatch({ type: 'logout' });
        sessionStorage.clear();
        navigate('/login');
    };

    return { login, handlerLogin, handlerLogout };
};
