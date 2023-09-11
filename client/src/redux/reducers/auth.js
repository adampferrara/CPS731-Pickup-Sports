const authReducer = (state = { authData: null, error: '' }, action) => {
    switch (action.type) {
        case "AUTH":
            localStorage.setItem("profile", JSON.stringify(action?.data));
            return { authData: action?.data };
        case "ERROR":
            return { ...state, error: action?.data };
        case "LOGOUT":
            localStorage.clear();
            return { authData: null };
        default:
            return state;
    }
};

export default authReducer;