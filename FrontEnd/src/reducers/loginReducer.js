
export const loginReducer = (state = {}, action) => {
    switch (action.type) {
        case 'login':
            return {
                isAuth: true,
                isSuperAdmin: action.payload.isSuperAdmin,
                isAdmin: action.payload.isAdmin,
                isDocente: action.payload.isDocente,
                user: action.payload.user,
            };
        case 'logout':
            return {
                isAuth: false,
                isAdmin: false,
                isSuperAdmin: false,
                isDocente: false,
                user: undefined,
            };
        case 'updateUser':
            return {
                ...state,
                user: action.payload.user,
            };
        default:
            return state;
    }
}
