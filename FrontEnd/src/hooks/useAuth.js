import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginReducer } from "../reducers/loginReducer";
import { loginUser } from "../services/authService";

// Función de inicialización para cargar el estado desde sessionStorage 
// o establecer el estado inicial.
const init = () => JSON.parse(sessionStorage.getItem('login')) || {
    isAuth: false,
    isAdmin: false,
    user: undefined,
};

// Manejo de autenticación utilizando un reducer para gestionar el estado de login/logout.
export const useAuth = () => {
    const [login, dispatch] = useReducer(loginReducer, undefined, init);
    const navigate = useNavigate();

    const handlerLogin = async ({ email, password }) => {
        try {
            const response = await loginUser({ email, password });
            const { token, userId, personaId, email: respEmail, roles: respRoles } = response.data;
            const claims = JSON.parse(window.atob(token.split('.')[1]));
            const user = {
                email: respEmail ?? claims.sub,
                id: userId,
                personaId: personaId ?? null,
            };
            const roles = respRoles ?? claims.roles ?? [];
            const isAdmin      = roles.includes("ROLE_ADMIN");
            const isSuperAdmin = roles.includes("ROLE_SUPER_ADMIN");
            const isDocente    = roles.includes("ROLE_DOCENTE");

            dispatch({ type: 'login', 
                payload: { user, isAdmin, isSuperAdmin, isDocente } 
            });

            sessionStorage.setItem('login', JSON.stringify({
                isAuth: true,
                isAdmin,
                isSuperAdmin,
                isDocente,
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
