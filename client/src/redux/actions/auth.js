import * as api from '../../api';

export const signIn = (formData) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);
        dispatch({ type: "AUTH", data });

    } catch (error) {
        const { data: { message } } = error.response;
        return message;
    }

};

export const signUp = (formData) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);

        dispatch({ type: "AUTH", data });

    } catch (error) {
        const { data: { message } } = error.response;
        return message;
    }
};


export const updateProfile = (formData) => async (dispatch) => {
    try {
        const { data } = await api.updateProfile(formData);

        dispatch({ type: "AUTH", data });

    } catch (error) {
        const { data: { message } } = error.response;
        return message;
    }
};