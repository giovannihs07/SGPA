import { useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { loginReducer } from "../reducers/loginReducer";
import { loginUser } from "../services/authService";
import { dashboardPath as resolveDashboardPath } from "../utils/authProfile";

// Función de inicialización para cargar el estado desde sessionStorage 
// o establecer el estado inicial.
const init = () => JSON.parse(sessionStorage.getItem('login')) || {
    isAuth: false,
    isAdmin: false,
    isSuperAdmin: false,
    isDocente: false,
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

            navigate(resolveDashboardPath({ isAuth: true, isSuperAdmin, isAdmin, isDocente }));
            return { ok: true };

        } catch (error) {
            const status = error.response?.status;

            if (status === 401) {
                return {
                    ok: false,
                    code: "INVALID_CREDENTIALS",
                    message: "Email o contraseña incorrectos",
                };
            }
            if (status === 403) {
                return {
                    ok: false,
                    code: "FORBIDDEN",
                    message: "No tienes permisos para acceder",
                };
            }
            if (status >= 500 || !error.response) {
                return { ok: false, code: "SERVER_ERROR" };
            }
            return { ok: false, code: "SERVER_ERROR" };
        }
    };

    const handlerLogout = () => {
        dispatch({ type: 'logout' });
        sessionStorage.clear();
        navigate('/login');
    };

    return { login, handlerLogin, handlerLogout };
};
