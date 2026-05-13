export const loginReducer = (state = {}, action) => {
    switch (action.type) {
        case 'login':
            return {
                isAuth: true,
                rol: action.payload.rol,
                user: action.payload.user,
            };
        case 'logout':
            return {
                isAuth: false,
                rol: undefined,
                user: undefined,
            };
        default:
            return state;
    }
}
